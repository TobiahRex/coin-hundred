/* eslint-disable import/prefer-default-export */

/**
  * function: _cleanBittrexPrices
  * 1) receive api response object of prices as @param.
  * 2) map over prices object and return only MarketName and Last price.
  *
  * @param {object} prices - api response object.
  *
  * @return {object} - clean prices objects.
*/

export const _cleanBittrexPrices = prices =>
  prices.reduce((acc, {
    MarketName: symbol,
    Last: last,
    High: high,
    Low: low,
    Bid: bid,
    Ask: ask,
    Volume: volume,
    BaseVoluem: baseVolume,
    TimeStamp: timeStamp,
    OpenBuyOrders: openBuyOrders,
    OpenSellOrders: openSellOrders,
    PrevDay: prevDay,
    marketCurrency,
    marketCurrencyLong,
    logoUrl,
  }) => {
    const obj = {
      symbol,
      timeStamp,
      high,
      low,
      bid,
      ask,
      volume,
      baseVolume,
      openBuyOrders,
      openSellOrders,
      prevDay,
      marketCurrency,
      marketCurrencyLong,
      logoUrl,
      last: String(last),
      exchange: 'bittrex',
    };
    if (symbol === 'BTC-USD') console.log(obj);

    if (symbol && last) {
      acc = ({ ...acc,
        [symbol]: { ...obj },
      });
    } else {
      acc = ({ [symbol]: { ...obj } });
    }
    return acc;
  }, {});
