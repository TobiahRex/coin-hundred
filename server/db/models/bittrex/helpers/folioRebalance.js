/* eslint-disable no-console */
/*
TODO:
- Refactor "getPortfolio"
* Need to determine how to fetch the current portfolio from the database.
* What kind of database.
* What's the difference between the database Schema and the asset object from the Front End?
- Front end should draw from the database.
- Back end should draw from the database.
- Desired changes made in the front end should be sent as "desired changes" to the database and stored.  Redux will simply articulate what's stored in the Back End database.
*/
import { Promise as bbPromise } from 'bluebird';
import bittrexApi from 'node-bittrex-api';
import binance from 'node-binance-api';

bittrexApi.options({
  apikey: process.env.BITTREX_API_KEY,
  apisecret: process.env.BITTREX_API_SECRET,
  inverse_callback_arguments: true,
});
binance.options({
  APIKEY: process.env.BINANCE_API_KEY,
  APISECRET: process.env.BINANCE_API_SECRET,
});

const _getExchangePrices = assets =>
  assets.reduce((a, assetObj) => {
    let binancePrices = {};

    binance.prices((tickers) => {
      binancePrices = { ...tickers };
    });

    const marketSummary = assetObj.prices.reduce((acc, next) => {
      acc.partialAssetPrices[next.symbol] = { ...next };

      switch (next.exchange) {
        case 'bittrex': {
          const bittrexRequest = new Promise((resolve, reject) => {
            bbPromise.fromCallback(cb =>
              bittrexApi.getmarketsummary({ market: next.symbol }, cb)
            )
            .then(resolve)
            .catch(reject);
          });
          acc.bittrexApiRequests.push(bittrexRequest);
          return acc;
        }

        case 'binance': {
          const currentPrice = binancePrices[next.symbol.split('-').join('')];
          next.price = currentPrice;
          return acc;
        }

        default: return acc;
      }
    }, {
      bittrexApiRequests: [],
      partialAssetPrices: {},
    });

    a = {
      bittrexApiRequests: [
        ...a.bittrexApiRequests,
        ...marketSummary.bittrexApiRequests,
      ],
      partialAssetPrices: {
        ...a.partialAssetPrices,
        ...marketSummary.partialAssetPrices,
      },
    };
    return a;
  }, {
    bittrexApiRequests: [],
    partialAssetPrices: {},
  });

// const _getPortfolio = assets =>
// assets.reduce((acc, n) => ({
//   ...acc,
//   [n.symbol]: { ...n },
// }), {});

const getAssetPrices = assets =>
new Promise((resolve, reject) => {
  // Call 3rd party exchange and fetch prices for each asset.
  // Calculate current asset value compared to it's Bitcoin value and dollar value.
  // Reduce the overall amount.
  // Return result.
  let workingPrices = {};
  // const portfolio = _getPortfolio(assets);

  const { bittrexApiRequests, partialAssetPrices } = _getExchangePrices(assets);
  console.log('partialAssetPrices: ', JSON.stringify(partialAssetPrices, null, 2));

  Promise.all([
    ...bittrexApiRequests,
  ])
  .then((results) => {
    workingPrices = { ...partialAssetPrices };
    console.log('workingPrices: ', workingPrices);
    let USD_BTC = '';

    // a) iterate through bittrex results and extract USD value from each asset.
    // b) add bittrex price to "updatedAsset" prices as a whole.
    const prices = results
    .map(({ result }) => {
      console.log('bittrex result: ', result);
      const
        resultPrice = result[0].Last,
        resultSymbol = result[0].MarketName,
        priceObj = workingPrices[resultSymbol];

      if (priceObj.exchange === 'bittrex') priceObj.price = resultPrice;
      if (resultSymbol === 'USDT-BTC') USD_BTC = resultPrice;

      return ({
        symbol: resultSymbol,
        btcPrice: USD_BTC,
        updatedPrices,
      });
    });
    resolve(prices);
  })
  .catch(reject);
});

// const rebalancePortfolio = (totalValue, portfolio) => {
//   const rebalanceSummary = Object
//   .keys(portfolio)
//   .map(symbol => portfolio[symbol])
//   .reduce((acc, n, i, array) => {
//     // identify new tokens added to portfolio.
//     // determine all tokens with custom percentages.
//     // infer all tokens with non-custom percentages.
//     // calculate non-custom token percentage distribution each.
//     // calculate percentage change per token between: "changed" & "unchanged".
//     // add auto token + amount to "re-allocation" pool.
//     // send re-allocation token to exchange & cash out to Bitcoin.
//     // buy new desired asset with custom percentage factor.
//     // send new tokens to app.
//
//     if (
//       !n.balance &&
//       !n.percentages.current &&
//       n.percentages.desired
//     ) {
//       console.log('Found new token.');
//       acc.custom.push(n);
//       acc.newTokens.push(n);
//       acc.customPercentTotal += Number(n.percentages.desired);
//     } else if (n.percentage.desired) {
//       console.log('Found custom percentage change for token: ', n.symbol);
//       acc.custom.push(n);
//       acc.customPercentTotal += Number(n.percentages.desired);
//       if (n.percentage.desired < n.percentage.current) {
//         console.log('Custom percentage is less than current percentage.');
//         acc.reAllocationPool.push(n);
//       }
//     } else if (
//       n.balance &&
//       n.percentages.current &&
//       (!n.percentages.desired || (n.percentages.desired === '0'))
//     ) {
//       console.log('Found undesired token with balance: ', n.symbol, '\nbalance: ', n.balance);
//       acc.reAllocationPool.push(n);
//     } else if (
//       n.percentages.desired &&
//       n.percentages.current &&
//       n.percentages.desired === n.percentages.current
//     ) {
//       console.log('Found generic token with no changes.');
//       acc.auto.push(n);
//       acc.reAllocationPool.push(n);
//     }
//
//     // const reqPercent = n.percentages.desired || 0;
//     // const currPercent = n.percentages.current || 0;
//     //
//     // if (reqPercent) {
//     //   if (currPercent) {
//     //     if (reqPercent > currPercent) acc.increased.push(n);
//     //
//     //     if (reqPercent !== currPercent) acc.reqPercent += Number(reqPercent);
//     //   } else {
//     //     console.log('Adding new token to portfolio: ', symbol); // eslint-disable-line
//     //   }
//     // } else if (!currPercent) {
//     //   console.log('You are missing a current & request percent for asset: ', n.symbol, '\nAsset will be discluded from your portfolio entirely.'); // eslint-disable-line
//     // }
//     //
//     // if (i === (array.length - 1)) acc.otherPercent = 1 - acc.reqPercent;
//     // acc.totalAssets += 1;
//     //
//     // return acc;
//   }, {
//     custom: [],
//     auto: [],
//     newTokens: [],
//     totalAssets: 0,
//     autoPercentTotal: 0,
//     customPercentTotal: 0,
//     reAllocationPool: [],
//   });
//
//   console.log('rebalanceSummary: ', rebalanceSummary);
// };

// const getPortfolioValue = (prices, usdBtc, portfolio) => {
//   const portfolioValue = prices.reduce((acc, { symbol, btcPrice }) => {
//     let tokenValue = symbol === 'BTC' ? btcPrice : usdBtc * btcPrice;
//
//     portfolio[symbol] = {
//       ...portfolio[symbol],
//       prices: {
//         btc: Number(btcPrice),
//         usd: tokenValue,
//       },
//       value: Number(portfolio[symbol].balance) * tokenValue,
//     };
//     return (acc += portfolio[symbol].value);
//   }, 0);
//
//   return ({
//     portfolio,
//     portfolioValue,
//   });
// };

const deposit = (newAsset, assets) => {
  if (!newAsset && typeof newAsset !== 'object') throw Error('Invalid argument "newAsset".');

  if (!assets && typeof assets !== 'object') throw Error('Invalid argument "assets".');

  /* Check current value of assets.
  - Fetch each Asset Price BTC-<Asset>
  - Get current overall portfolio value.
  - Assign new portfolio per new custom settings.
  */
  getAssetPrices(assets)
  .then((result) => {
    console.log('\n "getAssetPrices" RESULT: ', result);
  })
  .catch(err => {
    console.log('ERROR: ', err);
  });
  // .then(({ prices, usdBtc, portfolio }) =>
  // getPortfolioValue(prices, usdBtc, portfolio))
  // .then(({ portfolioValue, portfolio }) =>
  //   rebalancePortfolio(portfolioValue, portfolio)
};

deposit(
  {
    amount: 1,
    asset: 'BTC',
    from: '000000000123',
  },
  [
    {
      symbol: 'SALT',
      marketName: 'Salt',
      contractAddress: '0x123123123123',
      publicExgAddress: '0x123123123',
      coldStorageAddress: '0x123123123',
      decimals: '18',
      balance: '950',
      prices: [{
        exchange: 'bittrex',
        symbol: 'BTC-SALT',
        price: '',
      }, {
        exchange: 'bittrex',
        symbol: 'ETH-SALT',
        price: '',
      }],
      percentages: {
        current: '.2',
        desired: '.3',
      },
    }, {
      symbol: 'ADA',
      marketName: 'Cardano',
      contractAddress: '0x123123123123',
      publicExgAddress: '0x123123123',
      coldStorageAddress: '0x123123123',
      decimals: '18',
      balance: '1000',
      prices: [{
        exchange: 'bittrex',
        symbol: 'BTC-ADA',
        price: '',
      }, {
        exchange: 'bittrex',
        symbol: 'ETH-ADA',
        price: '',
      }],
      percentages: {
        current: '.2',
        desired: '.3',
      },
    }, {
      symbol: 'BTC',
      marketName: 'Bitcoin',
      contractAddress: '0x123123123123',
      publicExgAddress: '0x123123123',
      coldStorageAddress: '0x123123123',
      decimals: '18',
      balance: '2',
      prices: [{
        exchange: 'bittrex',
        symbol: 'USDT-BTC',
        price: '',
      }, {
        exchange: 'bittrex',
        symbol: 'BTC-ETH',
        price: '',
      }],
      percentages: {
        current: '.2',
        desired: '.3',
      },
    }, {
      symbol: 'ETH',
      marketName: 'Ethereum',
      contractAddress: '0x123123123123',
      publicExgAddress: '0x123123123',
      coldStorageAddress: '0x123123123',
      decimals: '18',
      balance: '6',
      prices: [{
        exchange: 'bittrex',
        symbol: 'USDT-ETH',
        price: '',
      }, {
        exchange: 'bittrex',
        symbol: 'BTC-ETH',
        price: '',
      }],
      percentages: {
        current: '.2',
        desired: '.3',
      },
    }, {
      symbol: 'BCC',
      marketName: 'Bitcoin Cash',
      contractAddress: '0x123123123123',
      publicExgAddress: '0x123123123',
      coldStorageAddress: '0x123123123',
      decimals: '18',
      balance: '2',
      prices: [{
        exchange: 'bittrex',
        symbol: 'BTC-BCC',
        price: '',
      }],
      percentages: {
        current: '.2',
        desired: '.3',
      },
    },
  ],
);
