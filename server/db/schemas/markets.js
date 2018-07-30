/* eslint-disable import/prefer-default-export */
import mongoose from 'mongoose';

export const marketsSchema = new mongoose.Schema({
  symbol: String,
  last: String,
  timeStamp: Date,
  exchange: String,
  MarketCurrency: String,
  BaseCurrency: String,
  MarketCurrencyLong: String,
  BaseCurrencyLong: String,
  MinTradeSize: Number,
  MarketName: String,
  IsActive: Boolean,
  Created: Date,
  LogoUrl: String,
});
