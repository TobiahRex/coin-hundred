/* eslint-disable import/prefer-default-export */
import { Promise as bbPromise } from 'bluebird';
import bittrexApi from 'node-bittrex-api';

bittrexApi.options({
  apikey: process.env.BITTREX_API_KEY,
  apisecret: process.env.BITTREX_API_SECRET,
  inverse_callback_arguments: true,
});

export const _getBittrexPrices = () =>
  new Promise((resolve, reject) => {
    bbPromise.fromCallback(cb => bittrexApi.getmarketsummaries(cb))
    .then(resolve)
    .catch(reject);
  });
