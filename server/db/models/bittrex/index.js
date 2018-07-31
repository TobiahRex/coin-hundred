/* eslint-disable arrow-body-style */
import mongoose from 'mongoose';
import bittrexApi from 'node-bittrex-api';
import { Promise as bbPromise } from 'bluebird';
// import folioRebalance from './helpers';

// console.log('%cbittrexApi', 'background:red;', bittrexApi);

bittrexApi.options({
  apikey: process.env.BITTREX_API_KEY,
  apisecret: process.env.BITTREX_API_SECRET,
  inverse_callback_arguments: true,
});

const bittrexSchema = new mongoose.Schema({
  results: String,
});

/*
  getMarketSummaries:
  1. Fetches general info from bittrex api and caches result.
  2. Using the cache, asks bittrex api for individual information in detailed,
    format for each market.
  3. Creates an updated marketSummary object combining new api response with cached response.

  bittrex                    server
    | <----- get all  <-------- |
    | ----- all markets ------> | cache response.  Then for each cached market...Request detailed information.
    |<---get 1 market's info----| <request
    |                           |
    |                           |
    |--> detailed mark. info--> | combine response with cache.
    |                           | deliver cache to caller.
*/
bittrexSchema.statics.getMarketSummaries = (cb) => {
  const marketsMemo = {};

  bbPromise.fromCallback(cb2 => bittrexApi.getmarkets(cb2))
  .then((data) => {
    data.result.forEach(({
      MarketCurrency,
      MarketCurrencyLong,
      LogoUrl,
    }) => {
      marketsMemo[MarketCurrency] = {
        LogoUrl,
        MarketCurrency,
        MarketCurrencyLong,
      };
    });
    return bbPromise.fromCallback(cb3 => bittrexApi.getmarketsummaries(cb3));
  })
  .then((data) => {
    data.result = data.result
      .map((market) => {
        console.log(marketsMemo[
          market.MarketName.split('-')[1]
        ].LogoUrl)
        return ({
          ...market,
          MarketCurrency: marketsMemo[
            market.MarketName.split('-')[1]
          ].MarketCurrency,
          MarketCurrencyLong: marketsMemo[
            market.MarketName.split('-')[1]
          ].MarketCurrencyLong,
          LogoUrl: marketsMemo[
            market.MarketName.split('-')[1]
          ].LogoUrl,
        });
      }
    );
    cb(null, data);
  })
  .catch(cb);
};

bittrexSchema.statics.getMarketSummary = (market, cb) => {
  bittrexApi.getmarketsummary({ market }, (err, data) => {
    if (err) cb(err);
    else cb(null, data);
  });
};

const Bittrex = mongoose.model('Bittrex', bittrexSchema);

export default Bittrex;
