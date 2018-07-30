const signalR = require ('signalr-client');
const jsonic = require('jsonic');
const zlib = require('zlib');

const client = new signalR.client('wss://socket.bittrex.com/signalr', ['c2']);

let market = 'BTC-USD',
    data,
    b64,
    raw,
    json;

client.serviceHandlers.connected = function (connection) {
  console.log ('connected');
  client.call ('c2', 'SubscribeToExchangeDeltas', market).done (function (err, result) {
    if (err) { return console.error (err); }
    if (result === true) {
      console.log ('Subscribed to ' + market);
    }
  });
}
client.end();
client.serviceHandlers.messageReceived = (message) => {
  data = jsonic(message.utf8Data);
  if (data.hasOwnProperty('M')) {
    if (data.M[0]) {
      if (data.M[0].hasOwnProperty('A')) {
        if (data.M[0].A[0]) {
          /**
           *  handling the GZip and base64 compression
           *  https://github.com/Bittrex/beta#response-handling
           */
          b64 = data.M[0].A[0];
          raw = new Buffer.from(b64, 'base64');

          zlib.inflateRaw(raw, (err, inflated) => {
            if (!err) {
              json = JSON.parse(inflated.toString('utf8'));
              console.log(json);
            }
          });
        }
      }
    }
  }
};
