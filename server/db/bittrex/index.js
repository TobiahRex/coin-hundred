import mongoose from 'mongoose';
import bittrexApi from 'node-bittrex-api';

bittrexApi.options({
  apikey: process.env.BITTREX_API_KEY,
  apisecret: process.env.BITTREX_API_SECRET,
  inverse_callback_arguments: true,
});

const bittrexSchema = new mongoose.Schema({
  results: String,
});

bittrexSchema.statics.getMarketSummaries = (cb) => {
  bittrexApi.getMarketSummaries((err, data) => {
    if (err) cb(err);
    cb(null, data);
  });
};

const Bittrex = mongoose.model('Bittrex', bittrexSchema);

export default Bittrex;
