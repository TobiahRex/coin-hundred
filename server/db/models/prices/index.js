/* eslint-disable import/prefer-default-export */
import bittrexApi from 'node-bittrex-api';
import mongoose from 'mongoose';
import { pricesSchema } from '../../schemas/prices';

import {
  _getBinancePrices,
  _getBittrexPrices,
  _cleanBinancePrices,
  _cleanBittrexPrices,
} from './helpers';

bittrexApi.options({
  apikey: process.env.BITTREX_API_KEY,
  apisecret: process.env.BITTREX_API_SECRET,
  inverse_callback_arguments: true,
});

pricesSchema.statics.getPrices = () => {
  Promise.all([
    _getBinancePrices(),
    _getBittrexPrices(),
  ])
  .then((prices) => {
    // console.log('bittrex prices: ', prices[1]);
    const cleanBinancePrices = _cleanBinancePrices(prices[0]);
    const cleanBittrexPrices = _cleanBittrexPrices(prices[1].result);
    console.log('cleanBinancePrices: ', JSON.stringify(cleanBinancePrices, null, 2));
    console.log('cleanBittrexPrices: ', JSON.stringify(cleanBittrexPrices, null, 2));
  })
  .catch((err) => {
    console.log('err: ', err);
  });
};

export const Prices = mongoose.model('Prices', pricesSchema);
