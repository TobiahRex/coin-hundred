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
  prices.reduce((acc, { MarketName, Last }) => {
    if (MarketName && Last) {
      acc = ({
        ...acc,
        [MarketName]: {
          symbol: MarketName,
          last: Last,
        },
      });
    } else {
      acc = ({
        [MarketName]: {
          symbol: MarketName,
          last: Last,
        },
      });
    }
    return acc;
  }, {});
