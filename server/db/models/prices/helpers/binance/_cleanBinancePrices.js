/* eslint-disable import/prefer-default-export */
const symbol = [
  '123456',
  'ETHBTC',
  'LTCBTC',
  'BNBBTC',
  'NEOBTC',
  'QTUMETH',
  'EOSETH',
  'SNTETH',
  'BNTETH',
  'BCCBTC',
  'GASBTC',
  'BNBETH',
  'BTCUSDT',
  'ETHUSDT',
  'HSRBTC',
];

const _cleanBinancePrices = prices => {
  prices.map((symbol) => {
    const iStart = symbol.lastIndexOf('BTC' || 'ETH');
    symbol


  })
  // return Object.keys(prices).map(symbolKey => {});
};

console.log(_cleanBinancePrices(symbol));
