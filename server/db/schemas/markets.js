/* eslint-disable import/prefer-default-export */
import mongoose from 'mongoose';

export const marketsSchema = new mongoose.Schema({
  symbol: String,
  marketName: String,
  logoUrl: String,
  exchanges: {
    bittrex: {
      last: String,
      symbol: String,
      date: String,
    },
    binance: {
      last: String,
      symbol: String,
      date: String,
    },
  },
});
