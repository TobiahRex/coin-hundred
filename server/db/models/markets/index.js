/* eslint-disable import/prefer-default-export, no-use-before-define */
import bittrexApi from 'node-bittrex-api';
import mongoose from 'mongoose';
import { marketsSchema } from '../../schemas/markets';

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

marketsSchema.statics.getPrices = () => {
  Promise.all([
    _getBinancePrices(),
    _getBittrexPrices(),
  ])
  .then((prices) => {
    return Markets.createOrUpdateMarketDocs({
      exchanges: {
        binance: _cleanBinancePrices(prices[0]),
        bittrex: _cleanBittrexPrices(prices[1].result),
      },
    });
  })
  .then(() => {
    console.log('success.');
  })
  .catch((err) => {
    console.log('err: ', err);
  });
};

marketsSchema.statics.findMarket = market =>
  new Promise((resolve, reject) => {
    if (!market) reject('Must supply required @param "market".');
    if (typeof market !== 'string') reject('Must supply a string for @param "market".');

    Markets
    .findOne(market)
    .exec()
    .then((dbMarket) => {
      if (dbMarket) resolve({ result: true, symbol: market });
      else resolve({ result: false, symbol: market });
    })
    .catch(reject);
  });

marketsSchema.statics.createOrUpdateMarketDocs = ({ exchanges }) =>
new Promise((resolve, reject) => {
  // iterate through bittrex & binance and check for existing documents.
  // if none is found, create a new one.
  // if is found, update existing document's price with current price.

  const lookupRequests = [];

  Object
  .keys(exchanges)
  .forEach((exchangeKey) => {
    const markets = exchanges[exchangeKey];

    Object
    .keys(markets)
    .forEach((marketKey) => {
      // Find if the symbol already exists.
      lookupRequests.push(Markets.findMarket(marketKey));
      // If not, create.
      // If yes, update.
    });
  });
});

export const Markets = mongoose.model('Markets', marketsSchema);
