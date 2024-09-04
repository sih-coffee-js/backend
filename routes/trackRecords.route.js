import express from 'express';
import { trackRecords, getRecordsbyDate } from '../controllers/trackRecords.controller.js';

const router = express.Router();

router.post('/track', trackRecords);
router.post('/getdate', getRecordsbyDate);

export default router;