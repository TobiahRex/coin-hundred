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
    // bbPromise.fromCallback(cb => bittrexApi.getmarketsummaries(cb))
    // .then(resolve)
    // .catch(reject);

    const marketsMemo = {};

    bbPromise.fromCallback(cb => bittrexApi.getmarkets(cb))
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
          return ({
            ...market,
            marketCurrency: marketsMemo[
              market.MarketName.split('-')[1]
            ].MarketCurrency,
            marketCurrencyLong: marketsMemo[
              market.MarketName.split('-')[1]
            ].MarketCurrencyLong,
            logoUrl: marketsMemo[
              market.MarketName.split('-')[1]
            ].LogoUrl,
          });
        }
      );
      resolve(data);
    })
    .catch(reject);
  });
