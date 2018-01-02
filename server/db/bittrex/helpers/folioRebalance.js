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

const tokens = {
  0: {
    symbol: 'SALT',
    contractAddress: '0x123123123123',
    decimals: '18',
    balance: '750',
    percentage: '.2',
    publicExgAddress: '0x123123123',
    exchange: 'bittrex',
    coldStorageAddress: '0x123123123',
  },
  1: {
    symbol: 'ADA',
    contractAddress: '0x123123123123',
    balance: '1000',
    percentage: '.2',
    publicExgAddress: '0x123123123',
    exchange: 'bittrex',
    coldStorageAddress: '0x123123123',
  },
  2: {
    symbol: 'BTC',
    contractAddress: '0x123123123123',
    balance: '15',
    percentage: '.2',
    publicExgAddress: '0x123123123',
    exchange: 'bittrex',
    coldStorageAddress: '0x123123123',
  },
  3: {
    symbol: 'ETH',
    contractAddress: '0x123123123123',
    balance: '6',
    percentage: '.2',
    publicExgAddress: '0x123123123',
    exchange: 'bittrex',
    coldStorageAddress: '0x123123123',
  },
  4: {
    symbol: 'BCH',
    contractAddress: '0x123123123123',
    balance: '5',
    percentage: '.2',
    publicExgAddress: '0x123123123',
    exchange: 'bittrex',
    coldStorageAddress: '0x123123123',
  },
};

const getMarketSummary = market =>
new Promise((resolve, reject) => {
  bbPromise.fromCallback(cb => bittrexApi.getmarketsummary({ market }, cb))
  .then(resolve)
  .catch(reject);
});

const getAssetPrices = assets =>
new Promise((resolve, reject) => {
  // call 3rd party exchange and fetch prices for each asset.
  // Calculate current asset value compared to it's Bitcoin value and dollar value.
  // reduce the overall amount.
  // return result.
  const assetReqs = assets.map(({  }))

  return ({
    SALT: {
      value: '15.00',
    },
    BTC: {
      value: '15000.00',
    },
    ETH: {
      value: '700.00',
    },
    BCH: {
      value: '3000.00',
    },
    ADA: {
      value: '0.70',
    },
  });
});

function deposit(amount, folio) {
  if (!amount && typeof amount !== 'object') throw Error('Invalid argument "amount".');

  if (!folio && typeof folio !== 'object') throw Error('Invalid argument "amount".');

  /* Check current value of assets.
  - Fetch each Asset Price BTC-<Asset>
  - Fetch BTC-USD price.
  - Multiply the overall value by the folio settings.
  */
  getAssetPrices(tokens)
  .then((prices) => {
    // Asset QTY => Asset Price (BTC) => All Assets(BTC) => BTC-USD => Final USD value.
    const folioUsdValue = Object
    .keys(tokens)
    .reduce((key, n) => {
      const token = tokens[key];
      const usdToken = prices[token.symbol].value * token.balance;
      return (n + usdToken);
    }, 0);
    // Divide USD value by desired folio Percentages.
    return rebalanceFolio(newFolio);
  })
  .then((newTokens) => {
    tokens = newTokens;
  });
}

console.log(
  deposit({ amount: 1, asset: 'BTC', from: '000000000123' }, {
    assets: [
      {
        symbol: 'SALT',
        percent: '.2',
      }, {
        symbol: 'ADA',
        percent: '.2',
      }, {
        symbol: 'BTC',
        percent: '.2',
      }, {
        symbol: 'ETH',
        percent: '.2',
      }, {
        symbol: 'BCH',
        percent: '.2',
      },
    ],
  },
));
