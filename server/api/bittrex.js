import express from 'express';
import Bittrex from '../db/models/bittrex';

const router = new express.Router();

router.get('/getMarketSummaries', (req, res) => {
  Bittrex.getMarketSummaries(res.handle);
});

export default router;
