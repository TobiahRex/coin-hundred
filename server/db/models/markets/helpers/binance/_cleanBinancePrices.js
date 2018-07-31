/* eslint-disable import/prefer-default-export, yoda */

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
  prices
  .map((_priceObj) => {
    const result = [
      'ETH', 'BTC', 'BNB', 'USDT',
    ]
    .map(major => clean(major, _priceObj.symbol, _priceObj))
    .reduce((acc, nextResult) => {
      if (nextResult) acc = nextResult;

      return acc;
    }, {});
    return result;
  })
  .reduce((acc, nextPriceObj) => {
    if (Object.keys(acc).length) {
      acc = ({
        ...acc,
        [nextPriceObj.symbol]: {
          ...nextPriceObj,
        },
      });
    } else {
      acc = ({
        [nextPriceObj.symbol]: {
          ...nextPriceObj,
        },
      });
    }
    return acc;
  }, {});

  /**
    * function: clean
    * 0) If invalid symbol immediately return {null}.
    * 1) save actual floating price value to "price".
    * 2) find index inside symbol string 'BTC1ST', of first occurance for "major" currency, e.g. one of ['BTC', 'ETH', 'USDT', 'BNB'].
    * 3) evaluate truthyness of step 2.
    * 4a) if found, assign "cleanSymbol" as properly formatted string 'BTC-1ST' or '1ST-BTC'.
    * 4b) if NOT found, assign "cleanSymbol" as {null}.
    * 5) if the original symbol does not match the clean symbol - due to other "major" currency matches, return null.
    * 6) Return {objet} with "cleanSymbol" and "prices" respectively.
    *
    * @param {string} major - one of ['BTC', 'ETH', 'USDT', 'BNB'].
    * @param {string} symbol - unclean symbol, e.g. 'BTC1ST'.
    * @param {object} prices - binance api response for prices.
    *
    * @return {object} - clean prices objects.
  */
function clean(major, symbol, priceObj) {
  if (!symbol) return null;

  let
    cleanSymbol = '';
  const
    majorStart = symbol.indexOf(major);

  if (majorStart) {
    if (majorStart > 0) {
      cleanSymbol = `${symbol.slice(0, majorStart)}-${major}`;
    } else {
      cleanSymbol = `${major}-${symbol.slice(3)}`;
    }
  } else return null;

  if (symbol !== cleanSymbol.split('-').join('')) {
    return null;
  }

  const {
    priceChange,
    priceChangePercent,
    weightedAvgPrice,
    prevClosePrice: prevDay,
    lastPrice: last,
    bidPrice: bid,
    askPrice: ask,
    openPrice: open,
    highPrice: high,
    lowPrice: low,
    volume,
    quoteVolume: baseVolume,
  } = priceObj;

  return ({
    symbol: cleanSymbol,
    timeStamp: new Date(),
    volume,
    baseVolume,
    open,
    high,
    low,
    prevDay,
    bid,
    ask,
    last,
    exchange: 'binance',
    priceChange,
    priceChangePercent,
    weightedAvgPrice,
  });
}
