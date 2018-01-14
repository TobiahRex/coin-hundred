/* eslint-disable import/prefer-default-export */
import mongoose from 'mongoose';

export const marketsSchema = new mongoose.Schema({
  symbol: String,
  exchanges: {
    bittrex: {
      last: String,
      symbol: String,
      timeStamp: Date,
    },
    binance: {
      last: String,
      symbol: String,
      timeStamp: Date,
    },
  },
});
