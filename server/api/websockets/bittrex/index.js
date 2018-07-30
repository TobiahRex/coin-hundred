/* eslint-disable new-cap, camelcase, consistent-return */

import signalR from 'signalr-client';
import crypto from 'crypto';
import jsonic from 'jsonic';
import helpers from './helperFunctions';

const log = require('ololog').configure({ locate: false });

const client = new signalR.client('wss://socket.bittrex.com/signalr', ['c2']);
const apiSecret = process.env.BINANCE_API_SECRET;
const apiKey = process.env.BINANCE_API_KEY;

const market = 'BTC-USD';

const signature = (secretKey, challenge) => crypto
    .createHmac('sha512', secretKey)
    .update(challenge)
    .digest('hex');

// Websocket Client Connect
client.serviceHandlers.messageReceived = (message) => {
  const data = jsonic(message.utf8Data);
  if ('M' in data) {
    if (data.M[0]) {
      if ('A' in data.M[0]) {
        if (data.M[0].A[0]) {
          const b64 = data.M[0].A[0];
          const raw = new Buffer.from(b64, 'base64');

          // zlib.
        }
      }
    }
  }
  log.white('message: ', message);
};

client.serviceHandlers.onerror = (message) => {
  log.red('error: ', message);
};

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
          client.on('c2', 'uE', helpers.onPublic);
        }
      });
    });
  });
};
