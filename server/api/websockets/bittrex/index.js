/* eslint-disable new-cap, camelcase */

import signalR from 'signalr-client';
import zlib from 'zlib';
import crypto from 'crypto';
import lodash from 'lodash';
import { map_keys } from './helperFunctions';

const log = require('ololog').configure({ locate: false });

const client = new signalR.client('wss://socket.bittrex.com/signalr', ['c2']);
const apiSecret = process.env.BINANCE_API_SECRET;
const apiKey = process.env.BINANCE_API_KEY;

const market = 'BTC-USD';

client.serviceHandlers.connected = () => {
  console.log ('connected');
  client.call ('c2', 'SubscribeToExchangeDeltas', market).done (function (err, result) {
    if (err) { return console.error (err); }
    if (result === true) {
      console.log ('Subscribed to ' + market);
    }
  });
}

const signature = (secretKey, challenge) => crypto
    .createHmac('sha512', secretKey)
    .update(challenge)
    .digest('hex');

const onPublic = (__update) => {
  const raw = new Buffer.from(__update, 'base64');

  zlib.bufferRaw(raw, (err, inflated) => {
    let obj = null;
    if (!err) {
      try {
        obj = JSON.parse(inflated.toString('utf8'));
      } catch (e) {
        log.red('Could not parse update: ', e);
      }

      if (obj.f) {
        log.lightGray('uE update... ', JSON.stringify(obj.f, null, 2));
      } else {
        const currentMarket = lodash.filter(obj.D, __obj => __obj.M === market);

        if (currentMarket.length > 0) {
          const summary = summaryCurrentMarket(currentMarket[0]);
          log.lightBlue('uS updated... \n', JSON.stringify(summary, null, 2));
        }
      }
    }
  });
};

// Websocket Client Connect
client.serviceHandlers.messageReceived = (message) => {
  log.white('message: ', message);
};

client.serviceHandlers.onerror = (message) => {
  log.red('error: ', message);
};

client.serviceHandlers.reconnecting = (retryData) => {
  console.log('retryData: ', retryData);
   /* retryData: { inital: true (first retry)/false (following retries),
                   count: retry count } */

  return true; // Abort retry
  // return false; // Retry
};
/*
*/
client.serviceHandlers.connected = () => {
  log.cyan('\n******* CONNECTED *******\n');

  client.call('c2', 'GetAuthContext', apiKey)
  .done((err_1, challenge) => {
    if (err_1) log.red(err_1);

    const signedChallenge = signature(apiSecret, challenge);

    client.call('c2', 'Authenticate', apiKey, signedChallenge)
    .done((auth_err, auth_result) => {
      if (auth_err) log.red('auth_ERROR: ', auth_err);
      else log.yellow('auth_result: ', auth_result);

      client.call('c2', 'SubscribeToExchangeDeltas', market)
      .done((err_2, result) => {
        if (err_2) log.red('Market Subscription Error: ', err_2);
        if (result === true) {
          client.on('c2', 'uE', onPublic);
        }
      });
    });
  });
};

function summaryCurrentMarket(__marketSummary) {
  return lodash.mapKeys(__marketSummary, (__val, __key) => {
    const key_long = map_keys(__key);
    return key_long;
  });
}
