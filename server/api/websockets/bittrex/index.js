/* eslint-disable new-cap, camelcase, consistent-return */

// import crypto from 'crypto';
// import zlib from 'zlib';
// import jsonic from 'jsonic';
import signalR from 'signalr-client';
import helpers from './helperFunctions';  //eslint-disable-line
const log = require('ololog').configure({ locate: false });
require('dotenv').config({ silent: true });

const client = new signalR.client('wss://socket.bittrex.com/signalr', ['c2']);
const market = process.env.MARKET;

// Websocket Client Connect
client.end();
client.serviceHandlers.connected = () => {
  log.cyan('\n******* CONNECTED *******\n');
  helpers.subscribeToAccount(client);
  // helpers.subscribeToMarket(client, market);
};
// client.serviceHandlers.messageReceived = (message) => {
//   const data = jsonic(message.utf8Data);
//   if ('M' in data) {
//     if (data.M[0]) {
//       if ('A' in data.M[0]) {
//         if (data.M[0].A[0]) {
//           const b64 = data.M[0].A[0];
//           const raw = new Buffer.from(b64, 'base64');
//
//           zlib.inflateRaw(raw, (err, inflated) => {
//             if (!err) {
//               const json = JSON.parse(inflated.toString('utf8'));
//               log.cyan(json);
//             }
//           });
//         }
//       }
//     }
//   }
//   // log.white('message: ', message);
// };

client.serviceHandlers.onerror = (message) => {
  log.red('error: ', message);
};
//
// client.serviceHandlers.connected = () => {
//   log.cyan('\n******* CONNECTED *******\n');
//
//   client.call('c2', 'GetAuthContext', apiKey)
//   .done((err_1, challenge) => {
//     if (err_1) log.red(err_1);
//
//     const signedChallenge = signature(apiSecret, challenge);
//
//     client.call('c2', 'Authenticate', apiKey, signedChallenge)
//     .done((auth_err, auth_result) => {
//       if (auth_err) log.red('auth_ERROR: ', auth_err);
//       else log.yellow('auth_result: ', auth_result);
//
//       client.call('c2', 'SubscribeToExchangeDeltas', market)
//       .done((err_2, result) => {
//         if (err_2) log.red('Market Subscription Error: ', err_2);
//         console.log('Subscribed to ' + market);
//         if (result === true) {
//           client.on('c2', 'uE', helpers.onPublic);
//         }
//       });
//     });
//   });
// };
