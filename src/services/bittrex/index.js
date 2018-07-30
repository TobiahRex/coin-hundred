import { create } from 'apisauce';

const {
  NODE_ENV,
  BASE_URL,
  DEPLOY_URL,
} = process.env;

function createAPI() {
  const api = create({
    baseURL: NODE_ENV === 'production' ? DEPLOY_URL : BASE_URL,
    headers: {
      'Cache-Control': 'no-cache',
      credentials: 'omit',
    },
  });

  const getMarketSummaries = () =>
    api.get('api/bittrex/getMarketSummaries');

  const getPrices = () =>
    api.get('api/prices/getprices');

  return {
    getPrices,
    getMarketSummaries,
  };
}

export default { createAPI };
