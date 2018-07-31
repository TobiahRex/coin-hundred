/* eslint-disable import/prefer-default-export */
import binance from 'node-binance-api';

binance.options({
  APIKEY: process.env.BINANCE_API_KEY,
  APISECRET: process.env.BINANCE_API_SECRET,
});

// export const _getBinancePrices = () =>
//   new Promise((resolve) => {
//     binance.prices(resolve);
//   });

export const _getBinancePrices = () =>
  new Promise((resolve, reject) => {
    binance.prevDay(false, (prevDay, err) => {
      if (!err) {
        resolve(prevDay);
      } else {
        reject('Could not get 24hr info for Binance prices:\n', err);
      }
    });
  });

export const _get24hrChange = ticker =>
  new Promise((resolve, reject) => {
    binance.prevDay(ticker, (err, prevDay, symbol) => {
      if (!err) {
        resolve(symbol);
      } else {
        reject('Could not get 24hr info for Binance prices:\n', err);
      }
    });
  });
