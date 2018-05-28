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

mongoose.Promise = bbPromise;

bittrexApi.options({
  apikey: process.env.BITTREX_API_KEY,
  apisecret: process.env.BITTREX_API_SECRET,
  inverse_callback_arguments: true,
});

marketsSchema.statics.getPrices = cb =>
  Promise.all([
    _getBinancePrices(),
    _getBittrexPrices(),
  ])
  .then(prices => Markets.createOrUpdateMarketDocs({
    exchanges: {
      binance: _cleanBinancePrices(prices[0]),
      bittrex: _cleanBittrexPrices(prices[1].result),
    },
  }))
  .then(result => cb(null, result))
  .catch(cb);

marketsSchema.statics.createMarket = marketObj =>
  new Promise((resolve, reject) => {
    if (!('symbol' in marketObj)) reject('FAILED: @Markets.createMarket - Must supply required param "marketObj".');
    if (marketObj && typeof marketObj !== 'object') reject('FAILED:  @Markets.createMarket - Must supply an {object} for param "marketObj".');

    bbPromise.fromCallback(cb =>
      Markets.create(marketObj, cb)
    )
    .then((newMarket) => {
      if ('_id' in newMarket) resolve(newMarket);
      else reject('FAILED: @func "createMarket".');
    })
    .catch(reject);
  });

marketsSchema.statics.updateMarket = marketObj =>
  new Promise((resolve, reject) => {
    if (!('symbol' in marketObj)) reject('FAILED: @Markets.updateMarket - Must supply required param "marketObj".');
    if (marketObj && typeof marketObj !== 'object') reject('FAILED:  @Markets.updateMarket - Must supply an {object} for param "marketObj".');

    bbPromise.fromCallback(cb =>
      Markets
      .findOne({ symbol: marketObj.symbol }, cb)
      .then((dbMarket) => { // eslint-disable-line consistent-return
        if (!('_id' in dbMarket)) {
          reject(`FAILED: Could not find market to update: "${marketObj.symbol}"`);
        } else {
          dbMarket.last = String(marketObj.last);
          dbMarket.timeStamp = marketObj.timeStamp;
          dbMarket.exchange = marketObj.exchange;

          return dbMarket.save({ new: true });
        }
      })
      .then(resolve)
      .catch(reject)
    );
  });

marketsSchema.statics.dbLookup = marketObj =>
  new Promise((resolve, reject) => {
    if (!('symbol' in marketObj)) reject('FAILED: @Markets.dbLookup - Must supply required param "marketObj".');
    if (marketObj && typeof marketObj !== 'object') reject('FAILED:  @Markets.dbLookup - Must supply an {object} for param "marketObj".');

    bbPromise.fromCallback(cb =>
      Markets
      .findOne({ symbol: marketObj.symbol }, cb)
      .then((dbMarket) => {
        if (dbMarket !== null) {
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
      .catch(reject)
    )
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
    // results = array of markets and db lookup status.
    const reqCollection = results.map(({ result, market }) => {
      if (result) return Markets.updateMarket(market);
      return Markets.createMarket(market);
    });
    return Promise.all(reqCollection);
  })
  .then(resolve)
  .catch(reject);
});

export const Markets = mongoose.model('Markets', marketsSchema);
