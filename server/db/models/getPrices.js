import bittrexApi from 'node-bittrex-api';
import binance from 'node-binance-api';
import { pricesSchema } from '../schemas/prices';

console.log('pricesSchema: ', pricesSchema);

bittrexApi.options({
  apikey: process.env.BITTREX_API_KEY,
  apisecret: process.env.BITTREX_API_SECRET,
  inverse_callback_arguments: true,
});
binance.options({
  APIKEY: process.env.BINANCE_API_KEY,
  APISECRET: process.env.BINANCE_API_SECRET,
});
