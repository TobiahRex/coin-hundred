/* eslint-disable import/prefer-default-export */
import mongoose from 'mongoose';

const pricesSchema = new mongoose.Schema({
  symbol: String,
  marketName: String,
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

export const Prices = mongoose.model('Prices', pricesSchema);
