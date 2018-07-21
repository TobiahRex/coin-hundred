import express from 'express';
import { Markets } from '../db/models/markets';

const router = new express.Router();

router.get('/getprices', (req, res) => Markets.getPrices(res.handle));

export default router;
