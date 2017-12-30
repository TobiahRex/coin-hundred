import express from 'express';
import bittrex from './bittrex';
import things from './things';

const router = new express.Router();

router.use('/bittrex', bittrex);
router.use('/things', things);

export default router;
