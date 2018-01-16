/* eslint-disable import/prefer-default-export, no-use-before-define */
import bittrexApi from 'node-bittrex-api';
import mongoose from 'mongoose';
import { Promise as bbPromise } from 'bluebird';
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

marketsSchema.statics.createMarket = marketObj =>
  new Promise((resolve, reject) => {
    if (!('symbol' in marketObj)) reject('FAILED: @Markets.createMarket - Must supply required param "marketObj".');
    if (marketObj && typeof marketObj !== 'object') reject('FAILED:  @Markets.createMarket - Must supply an {object} for param "marketObj".');

    bbPromise.fromCallback(cb =>
      Markets.create({ ...marketObj.market }, cb)
    )
    .then((newMarket) => {
      if ('_id' in newMarket) resolve();
      else reject('FAILED: @func "createMarket".');
    })
    .catch(reject);
  });

marketsSchema.statics.findMarketAndUpdate = marketObj =>
  new Promise((resolve, reject) => {
    if (!('symbol' in marketObj)) reject('FAILED: @Markets.findMarketAndUpdate - Must supply required param "marketObj".');
    if (marketObj && typeof marketObj !== 'object') reject('FAILED:  @Markets.findMarketAndUpdate - Must supply an {object} for param "marketObj".');

    Markets
    .findOne({ symbol: marketObj.symbol })
    .exec()
    .then((dbMarket) => { // eslint-disable-line consistent-return
      if (!('_id' in dbMarket)) {
        reject(`FAILED: Could not find market to update: "${marketObj.symbol}"`);
      } else {
        dbMarket.last = marketObj.last;
        dbMarket.timeStamp = marketObj.timeStamp;
        dbMarket.exchange = marketObj.exchange;

        return dbMarket.save({ new: true });
      }
    })
    .then(resolve)
    .catch(reject);
  });

marketsSchema.statics.dbLookup = marketObj =>
  new Promise((resolve, reject) => {
    if (!('symbol' in marketObj)) reject('FAILED: @Markets.dbLookup - Must supply required param "marketObj".');
    if (marketObj && typeof marketObj !== 'object') reject('FAILED:  @Markets.dbLookup - Must supply an {object} for param "marketObj".');

    Markets
    .findOne(marketObj.symbol)
    .exec()
    .then((dbMarket) => {
      if ('_id' in dbMarket) {
        resolve({
          result: true,
          market: { ...marketObj },
        });
      } else {
        resolve({
          result: false,
          market: { ...marketObj },
        });
      }
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
      lookupRequests.push(Markets.dbLookup(markets[marketKey]));
    });
  });

  Promise.all([
    ...lookupRequests,
  ])
  .then((results) => {
    const createOrUpdateReqs = results.map(({ result, market }) => {
      if (result) return Markets.updateMarket(market);
      return Markets.createMarket(market);
    });
    return Promise.all(createOrUpdateReqs);
  })
  .then(() => {
    console.log('finished updated or creating markets.');
  })
  .catch(reject);
});

export const Markets = mongoose.model('Markets', marketsSchema);
