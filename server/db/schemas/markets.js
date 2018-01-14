/* eslint-disable import/prefer-default-export */
import mongoose from 'mongoose';

export const marketsSchema = new mongoose.Schema({
  symbol: String,
  last: String,
  timeStamp: Date,
  exchange: String,
});
