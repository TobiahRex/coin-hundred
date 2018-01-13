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

export const _combinePrices = prices => {
  const memo = {};
  prices.forEach((priceObj) => {
    
  })

  Object.keys((symbolKey) => {
    if (!memo[symbolKey]) {
      memo[symbolKey] = {
        ...prices[symbolKey],
      };
    }
  })
};
