/* eslint-disable import/prefer-default-export */

const detectMajor = (major, symbol, prices) => {
  const price = prices[symbol];
  const majorStart = symbol.indexOf(major);
  let cleanSymbol = '';
  if (majorStart) {
    if (majorStart > 0) {
      cleanSymbol = `${symbol.slice(0, majorStart)}-${major}`;
    } else {
      cleanSymbol = `${major}-${symbol.slice(3)}`;
    }
  } else {
    return null;
  }
  return ({
    symbol: cleanSymbol,
    last: price,
  });
};

export const _cleanBinancePrices = prices =>
  Object.keys(prices)
  .map((symbol) => {
    const majors = [
      'ETH',
      'BTC',
      'BNB',
      'USDT',
    ];
    .forEach((major) => detectMajor(major, symbol, prices))
  });
// export const _cleanBinancePrices = prices =>
//   Object.keys(prices)
//   .map((symbol) => {
//     const price = prices[symbol];
//
//     const btcStart = symbol.indexOf('BTC');
//     const ethStart = symbol.indexOf('ETH');
//     const usdtStart = symbol.indexOf('USDT');
//     const bnbStart = symbol.indexOf('BNB');
//     let cleanSymbol = '';
//
//     if (btcStart) {
//       if (btcStart > 0) {
//         cleanSymbol = `${symbol.slice(0, btcStart)}-BTC`;
//       } else {
//         cleanSymbol = `BTC-${symbol.slice(3)}`;
//       }
//     } else if (ethStart) {
//       if (ethStart > 0) {
//         cleanSymbol = `${symbol.slice(0, ethStart)}-ETH`;
//       } else {
//         cleanSymbol = `ETH-${symbol.slice(3)}`;
//       }
//     } else if (usdtStart) {
//       if (usdtStart > 0) {
//         cleanSymbol = `${symbol.slice(0, usdtStart)}-USDT`;
//       } else {
//         cleanSymbol = `USDT-${symbol.slice(3)}`;
//       }
//     } else if (bnbStart) {
//       if (bnbStart > 0) {
//         cleanSymbol = `${symbol.slice(0, bnbStart)}-BNB`;
//       } else {
//         cleanSymbol = `BNB-${symbol.slice(3)}`;
//       }
//     }
//     return ({
//       symbol: cleanSymbol,
//       last: price,
//     });
//   });
