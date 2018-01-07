// import express from 'express';
import { Prices } from '../db/models/prices';
//
// const router = new express.Router();
//
// router.get('/getMarketSummaries', (req, res) => {
//   Bittrex.getMarketSummaries(res.handle);
// });
//
// export default router;
Prices.getPrices();
