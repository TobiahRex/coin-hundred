/* eslint-disable import/prefer-default-export */
import mongoose from 'mongoose';

export const marketsSchema = new mongoose.Schema({
  symbol: String,
  timeStamp: Date,
  volume: Number,
  baseVolume: Number,
  open: Number,
  high: Number,
  low: Number,
  prevDay: Number,
  bid: Number,
  ask: Number,
  last: String,
  openBuyOrders: Number,
  openSellOrders: Number,
  marketCurrency: String,
  marketCurrencyLong: String,
  logoUrl: String,
  exchange: String,
  priceChange: String,
  priceChangePercent: String,
  weightedAvgPrice: String,
});


"symbol": "BNBBTC",
"priceChange": "-94.99999800",
"priceChangePercent": "-95.960",
"weightedAvgPrice": "0.29628482",
"prevClosePrice": "0.10002000",
"lastPrice": "4.00000200",
"lastQty": "200.00000000",
"bidPrice": "4.00000000",
"askPrice": "4.00000200",
"openPrice": "99.00000000",
"highPrice": "100.00000000",
"lowPrice": "0.10000000",
"volume": "8913.30000000",
"quoteVolume": "15.30000000",
"openTime": 1499783499040,
"closeTime": 1499869899040,
"firstId": 28385,   // First tradeId
"lastId": 28460,    // Last tradeId
"count": 76         // Trade count
