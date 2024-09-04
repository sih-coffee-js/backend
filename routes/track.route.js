import express from 'express';
import { getTrackRecords } from '../controllers/track.controller.js';

const router = express.Router();

router.get('/', getTrackRecords);

export default router;
