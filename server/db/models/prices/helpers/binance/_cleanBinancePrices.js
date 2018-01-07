/* eslint-disable import/prefer-default-export */

/**
  * function: _cleanBinancePrices
  * 1) receive api response object of prices as @param.
  * 2a) map over keys (symbols) and insert symbol into "clean()" as arg 2.
  * 2b) simultaneously map over the 4 base currencies, per symbol and insert into "clean()" as arg 1.
  * 3) "clean()" will return an array per base currency.  All but 1 of the results will be null.  Reduce this array...
  * 4) Reduce results into a single object result as array input.
  * 5) Further reduce the single object per symbol, form an array into a final object with the format...
    {
      [symbol]: {
        symbol: 'BTC-1ST',
        last: '0.234234234',
      },
      ...x more results,
    }
  *
  * @param {object} prices - api response object.
  *
  * @return {object} - clean prices objects.
*/

export const _cleanBinancePrices = prices =>
  Object
  .keys(prices)
  .map((symbol) => {
    const 
    const result = [
      'ETH', 'BTC', 'BNB', 'USDT',
    ]
    .map(major => clean(major, symbol, prices))
    .reduce((acc, nextResult) => {
      if (nextResult) acc.push(nextResult);

      return acc;
    }, []);
    console.log('result: ', result);
    return result;
  })
  .reduce((acc, nextPriceObj) => {
    acc = {
      ...acc,
      [nextPriceObj.symbol]: {
        ...nextPriceObj,
      },
    };
    return acc;
  }, {});

  /**
    * function: clean
    * 1) save actual floating price value to "price".
    * 2) find index inside symbol string 'BTC1ST', of first occurance for "major" currency, e.g. one of ['BTC', 'ETH', 'USDT', 'BNB'].
    * 3) evaluate truthyness of step 2.
    * 4a) if found, assign "cleanSymbol" as properly formatted string 'BTC-1ST' or '1ST-BTC'.
    * 4b) if NOT found, assign "cleanSymbol" as {null}.
    * 5) Return {objet} with "cleanSymbol" and "prices" respectively.
    *
    * @param {string} major - one of ['BTC', 'ETH', 'USDT', 'BNB'].
    * @param {string} symbol - unclean symbol, e.g. 'BTC1ST'.
    * @param {object} prices - binance api response for prices.
    *
    * @return {object} - clean prices objects.
  */
function clean(major, symbol, prices) {
  let cleanSymbol = '';
  const
    price = prices[symbol],
    majorStart = symbol.indexOf(major);

  if (majorStart) {
    if (majorStart > 0) {
      cleanSymbol = `${symbol.slice(0, majorStart)}-${major}`;
    } else {
      cleanSymbol = `${major}-${symbol.slice(3)}`;
    }
  } else return null;

  return ({
    symbol: cleanSymbol,
    last: price,
  });
}
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
