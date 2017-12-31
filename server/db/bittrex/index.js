import mongoose from 'mongoose';
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

  bittrexApi.getmarkets((err, data) => {
    if (err) cb(err);
    else {
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

      console.log('marketsMemo: ', marketsMemo);

      bittrexApi.getmarketsummaries((err2, data2) => {
        if (err2) cb(err2);
        else {
          data2.result = data2.result
            .map(market => {
              return ({
                ...market,
                MarketCurrency: marketsMemo[
                  market.MarketName.substr(market.MarketName.length - 3)
                ].MarketCurrency,
                MarketCurrencyLong: marketsMemo[
                  market.MarketName.substr(market.MarketName.length - 3)
                ].MarketCurrencyLong,
                LogoUrl: marketsMemo[
                  market.MarketName.substr(market.MarketName.length - 3)
                ].LogoUrl,
              });
            }
            );
          cb(null, data2);
        }
      });
    }
  });
};

bittrexSchema.statics.getMarketSummary = (market, cb) => {
  bittrexApi.getmarketsummary({ market }, (err, data) => {
    if (err) cb(err);
    else cb(null, data);
  });
};

const Bittrex = mongoose.model('Bittrex', bittrexSchema);

export default Bittrex;
