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

/*
  Parallel operation: fetches prices from both Binance and Bittrex exchanges.
  Creates a new DB document for each market if does not already exist.  If already exists
  updates market data in DB. Returns all results.

  NOTE: Long Term Outlook: This function will be used to update all market data periodically.
*/
marketsSchema.statics.getPrices = cb =>
  Promise.all([
    _getBinancePrices(),
    _getBittrexPrices(),
  ])
  .then((prices) => { // eslint-disable-line
    return Markets.createOrUpdateMarketDocs({
      exchanges: {
        binance: _cleanBinancePrices(prices[0]),
        bittrex: _cleanBittrexPrices(prices[1].result),
      },
    });
  })
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
      else reject('FAILED: @func "Markets.createMarket".');
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
            exists: true,
            market: { ...marketObj },
          });
        } else {
          resolve({
            exists: false,
            market: { ...marketObj },
          });
        }
      })
      .catch(reject)
    );
  });

marketsSchema.statics.createOrUpdateMarketDocs = ({ exchanges }) =>
new Promise((resolve, reject) => {
  // iterate through bittrex & binance and check for existing documents.
  // if none is found, create a new one.
  // if found, update existing document's price with current price.

  const lookupRequests = [];

  // create lookup requests for all cached markets across all cached exchanges.
  Object
  .keys(exchanges)
  .forEach((exchangeKey) => {  // for each exchange
    const markets = exchanges[exchangeKey];

    Object
    .keys(markets)
    .forEach((marketKey) => { // iterate over each market
      lookupRequests.push(Markets.dbLookup(markets[marketKey]));
    });
  });

  // linearly lookup all markets within DB.
  Promise.all([
    ...lookupRequests,
  ])
  .then((results) => {
    // results = array of markets and db lookup status.
    const reqCollection = results.map(({ exists, market }) => {
      if (exists) return Markets.updateMarket(market);
      return Markets.createMarket(market);
    });
    return Promise.all(reqCollection);
  })
  .then(resolve)
  .catch(reject);
});

export const Markets = mongoose.model('Markets', marketsSchema);
