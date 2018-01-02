/*
Rebalance the portfolio;
- Hash table containing all tokens owned.
1) New deposit of 1 Bitcoin - distributed across all owned tokens evenly.
2) New deposit of 1 Bitcoin - increase ETH to 30% and evenly distribute rest.
3) New deposit of 1 Bitcoin - increase ETH, BCH & BTC to 20% each, and 40% evenly across remaining tokens.
4) Send tokens to Cold Storage device from their respective exchanges.
*/

import { Promise as bbPromise } from 'bluebird';
import bittrexApi from 'node-bittrex-api';

bittrexApi.options({
  apikey: process.env.BITTREX_API_KEY,
  apisecret: process.env.BITTREX_API_SECRET,
  inverse_callback_arguments: true,
});

const getMarketSummary = market =>
new Promise((resolve, reject) => {
  bbPromise.fromCallback(cb => bittrexApi.getmarketsummary({ market }, cb))
  .then(resolve)
  .catch(reject);
  /* getMarketSummary result =
  {
    MarketName: 'BTC-SALT',
    High: 0.00096938,
    Low: 0.00079153,
    Volume: 1235298.63211953,
    Last: 0.00090106,
    BaseVolume: 1109.3424853,
    TimeStamp: '2018-01-02T05:32:45.267',
    Bid: 0.00089936,
    Ask: 0.00090106,
    OpenBuyOrders: 1660,
    OpenSellOrders: 3754,
    PrevDay: 0.000882,
    Created: '2017-10-16T17:32:48.777'
  }
  */
});

const getPortfolio = assets =>
  assets.reduce((acc, n) => ({
    ...acc,
    [n.symbol]: { ...n },
  }), {});

const getAssetPriceReq = assets =>
assets.map(asset => getMarketSummary(
  asset.symbol === 'BTC' ? 'USDT-BTC' : `BTC-${asset.symbol}`)
);

const getAssetPrices = assets =>
new Promise((resolve, reject) => {
  // Call 3rd party exchange and fetch prices for each asset.
  // Calculate current asset value compared to it's Bitcoin value and dollar value.
  // Reduce the overall amount.
  // Return result.
  const portfolio = getPortfolio(assets);
  const apiRequests = getAssetPriceReq(assets);

  Promise.all([...apiRequests])
  .then((results) => {
    let USD_BTC = '';

    const prices = results
    .map(({ result }) => {
      const symbol = result[0].MarketName.split('-')[1];
      if (symbol === 'BTC') USD_BTC = result[0].Last;
      return ({
        symbol: result[0].MarketName.split('-')[1],
        btcPrice: result[0].Last,
      });
    });
    return ({
      prices,
      usdBtc: USD_BTC,
    });
  })
  .catch(reject);
});
// return ({
//   SALT: {
//     value: '15.00',
//   },
//   BTC: {
//     value: '15000.00',
//   },
//   ETH: {
//     value: '700.00',
//   },
//   BCH: {
//     value: '3000.00',
//   },
//   ADA: {
//     value: '0.70',
//   },
// });

function deposit(newAsset, assets) {
  if (!newAsset && typeof newAsset !== 'object') throw Error('Invalid argument "newAsset".');

  if (!assets && typeof assets !== 'object') throw Error('Invalid argument "assets".');

  /* Check current value of assets.
  - Fetch each Asset Price BTC-<Asset>
  - Fetch BTC-USD price.
  - Multiply the overall value by the folio settings.
  */
  getAssetPrices(assets)
  // .then((prices) => {
  //   // Asset QTY => Asset Price (BTC) => All Assets(BTC) => BTC-USD => Final USD value.
  //   const folioUsdValue = Object
  //   .keys(tokens)
  //   .reduce((key, n) => {
  //     const token = tokens[key];
  //     const usdToken = prices[token.symbol].value * token.balance;
  //     return (n + usdToken);
  //   }, 0);
  //   // Divide USD value by desired folio Percentages.
  //   return rebalanceFolio(newFolio);
  // })
  // .then((newTokens) => {
  //   tokens = newTokens;
  // });
}

console.log(
  deposit(
    {
      amount: 1,
      asset: 'BTC',
      from: '000000000123',
    },
    [
      {
        symbol: 'SALT',
        contractAddress: '0x123123123123',
        decimals: '18',
        balance: '750',
        percentage: '.2',
        publicExgAddress: '0x123123123',
        exchange: 'bittrex',
        coldStorageAddress: '0x123123123',
      }, {
        symbol: 'ADA',
        contractAddress: '0x123123123123',
        balance: '1000',
        percentage: '.2',
        publicExgAddress: '0x123123123',
        exchange: 'bittrex',
        coldStorageAddress: '0x123123123',
      }, {
        symbol: 'BTC',
        contractAddress: '0x123123123123',
        balance: '15',
        percentage: '.2',
        publicExgAddress: '0x123123123',
        exchange: 'bittrex',
        coldStorageAddress: '0x123123123',
      }, {
        symbol: 'ETH',
        contractAddress: '0x123123123123',
        balance: '6',
        percentage: '.2',
        publicExgAddress: '0x123123123',
        exchange: 'bittrex',
        coldStorageAddress: '0x123123123',
      }, {
        symbol: 'BCC',
        contractAddress: '0x123123123123',
        balance: '5',
        percentage: '.2',
        publicExgAddress: '0x123123123',
        exchange: 'bittrex',
        coldStorageAddress: '0x123123123',
      },
    ],
  )
);
