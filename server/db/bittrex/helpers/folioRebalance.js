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
        if (symbol === 'BTC') USD_BTC = Number(result[0].Last);
        return ({
          symbol: result[0].MarketName.split('-')[1],
          btcPrice: Number(result[0].Last),
        });
      });

      resolve({
        prices,
        portfolio,
        usdBtc: USD_BTC,
      });
    })
    .catch(reject);
  });

const rebalancePortfolio = (totalValue, portfolio) => {
  const percentages = Object
  .keys(portfolio)
  .map(symbol => portfolio[symbol])
  .reduce((acc, n, i, array) => {
    const reqPercent = n.percentages.desired || 0;
    const currPercent = n.percentages.current || 0;

    if (reqPercent) {
      if (currPercent) {
        if (reqPercent !== currPercent) {
          acc.reqPercent += Number(reqPercent);
        }
      } else {
        n.percentages.currPercent = 0;
      }
    }

    if (i === (array.length - 1)) acc.otherPercent = 1 - acc.reqPercent;
    acc.totalAssets += 1;

    return acc;
  }, {
    totalAssets: 0,
    reqPercent: 0,
    otherPercent: 0,
  });

  console.log('percentages: ', percentages);
};

const getPortfolioValue = (prices, usdBtc, portfolio) => {
  const portfolioValue = prices.reduce((acc, { symbol, btcPrice }) => {
    let tokenValue = symbol === 'BTC' ? btcPrice : usdBtc * btcPrice;

    portfolio[symbol] = {
      ...portfolio[symbol],
      prices: {
        btc: Number(btcPrice),
        usd: tokenValue,
      },
      value: Number(portfolio[symbol].balance) * tokenValue,
    };
    return (acc += portfolio[symbol].value);
  }, 0);

  return ({
    portfolio,
    portfolioValue,
  });
};

const deposit = (newAsset, assets) => {
  if (!newAsset && typeof newAsset !== 'object') throw Error('Invalid argument "newAsset".');

  if (!assets && typeof assets !== 'object') throw Error('Invalid argument "assets".');

  /* Check current value of assets.
  - Fetch each Asset Price BTC-<Asset>
  - Get current overall portfolio value.
  - Assign new portfolio per new custom settings.
  */
  getAssetPrices(assets)
  .then(({ prices, usdBtc, portfolio }) =>
    getPortfolioValue(prices, usdBtc, portfolio))
  .then(({ portfolioValue, portfolio }) =>
    rebalancePortfolio(portfolioValue, portfolio)
  ).catch(console.log);
};

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
        percentages: {
          current: '.2',
          desired: '.3',
        },
        publicExgAddress: '0x123123123',
        exchange: 'bittrex',
        coldStorageAddress: '0x123123123',
      }, {
        symbol: 'ADA',
        contractAddress: '0x123123123123',
        balance: '1000',
        percentages: {
          current: '.2',
          desired: '',
        },
        publicExgAddress: '0x123123123',
        exchange: 'bittrex',
        coldStorageAddress: '0x123123123',
      }, {
        symbol: 'BTC',
        contractAddress: '0x123123123123',
        balance: '15',
        percentages: {
          current: '.2',
          desired: '.3',
        },
        publicExgAddress: '0x123123123',
        exchange: 'bittrex',
        coldStorageAddress: '0x123123123',
      }, {
        symbol: 'ETH',
        contractAddress: '0x123123123123',
        balance: '6',
        percentages: {
          current: '.2',
          desired: '',
        },
        publicExgAddress: '0x123123123',
        exchange: 'bittrex',
        coldStorageAddress: '0x123123123',
      }, {
        symbol: 'BCC',
        contractAddress: '0x123123123123',
        balance: '5',
        percentages: {
          current: '.2',
          desired: '',
        },
        publicExgAddress: '0x123123123',
        exchange: 'bittrex',
        coldStorageAddress: '0x123123123',
      },
    ],
  )
);
