import bittrexApi from 'node-bittrex-api';
import { pricesSchema } from '../schemas/prices';

import {
  _getBinancePrices,
  // _getBittrexPrices,
} from './helpers';

console.log('pricesSchema: ', pricesSchema);

bittrexApi.options({
  apikey: process.env.BITTREX_API_KEY,
  apisecret: process.env.BITTREX_API_SECRET,
  inverse_callback_arguments: true,
});

pricesSchema.statics.getPrices = () => {
  Promise.all([
    _getBinancePrices(),
    // _getBittrexPrices(),
  ])
  .then((prices) => {
    console.log('prices: ', prices);
  })
  .catch((err) => {
    console.log('err: ', err);
  })
}
