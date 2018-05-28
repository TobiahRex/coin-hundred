import express from 'express';
import prices from './prices';
import bittrex from './bittrex';
import things from './things';

const router = new express.Router();

router.use('/bittrex', bittrex);
router.use('/prices', prices);
router.use('/things', things);

export default router;
