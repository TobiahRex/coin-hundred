import mongoose from 'mongoose';
import { Promise as bbPromise } from 'bluebird';
import bittrexApi from 'node-bittrex-api';

console.log('%cbittrexApi', 'background:red;', bittrexApi);

bittrexApi.options({
  apikey: process.env.BITTREX_API_KEY,
  apisecret: process.env.BITTREX_API_SECRET,
  inverse_callback_arguments: true,
});

const bittrexSchema = new mongoose.Schema({
  results: String,
});

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
      .map(market => ({
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
      }));
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
