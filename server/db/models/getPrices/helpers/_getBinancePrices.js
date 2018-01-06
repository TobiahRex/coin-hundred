/* eslint-disable import/prefer-default-export */
import binance from 'node-binance-api';

binance.options({
  APIKEY: process.env.BINANCE_API_KEY,
  APISECRET: process.env.BINANCE_API_SECRET,
});

export const _getBinancePrices = () =>
  new Promise((resolve) => {
    binance.prices(resolve);
  });
