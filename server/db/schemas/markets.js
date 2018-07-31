/* eslint-disable import/prefer-default-export */
import mongoose from 'mongoose';

export const marketsSchema = new mongoose.Schema({
  symbol: String,
  timeStamp: Date,
  high: Number,
  volume: Number,
  baseVolume: Number,
  lo: Number,
  bid: Number,
  ask: Number,
  openBuyOrders: Number,
  openSellOrders: Number,
  prevDay: Number,
  created: Date,
  marketCurrency: String,
  marketCurrencyLong: String,
  logoUrl: String,
  last: String,
  exchange: String,
});
