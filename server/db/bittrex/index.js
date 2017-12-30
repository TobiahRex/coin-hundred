import mongoose from 'mongoose';
import bittrexApi from 'node-bittrex-api';
console.log('%cbittrexApi', 'background:red;', bittrexApi);

bittrexApi.options({
  apikey: process.env.BITTREX_API_KEY,
  apisecret: process.env.BITTREX_API_SECRET,
  inverse_callback_arguments: true,
});

const bittrexSchema = new mongoose.Schema({
  results: String,
});

bittrexSchema.statics.getMarketSummaries = (cb) => {
  bittrexApi.getmarketsummaries((err, data) => {
    if (err) {
      console.log('error: ', err);
      cb(err);
    } else {
      cb(null, data);
    }
  });
};

const Bittrex = mongoose.model('Bittrex', bittrexSchema);

export default Bittrex;
