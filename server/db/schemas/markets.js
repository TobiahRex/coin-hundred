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
