/* eslint-disable import/prefer-default-export */
const symbols = [
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

const _cleanBinancePrices = (prices) => {
  prices.map((symbol) => {
    const btcStart = symbol.indexOf('BTC');
    let mysterySym = '';

    if (btcStart) {
      if (btcStart > 0) {
        mysterySym = `${symbol.slice(0, btcStart)}-BTC`;
      } else {
        mysterySym = `BTC-${symbol.slice(3)}`;
      }
    }
    return mysterySym;
  });
  // return Object.keys(prices).map(symbolKey => {});
};

console.log(_cleanBinancePrices(symbols));
