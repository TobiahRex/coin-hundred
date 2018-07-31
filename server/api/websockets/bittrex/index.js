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
// client.end();
client.serviceHandlers.connected = () => {
  log.cyan('\n******* CONNECTED *******\n');
  helpers.subscribeToAccount(client);
  // helpers.subscribeToMarket(client, market);
};
// client.end();
