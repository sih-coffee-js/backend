import express from 'express';
import { trackRecords, getRecordsbyDate, getRecords, getAllRecordsbyDate } from '../controllers/trackRecords.controller.js';

const router = express.Router();

router.post('/track', trackRecords);
router.post('/getdate', getRecordsbyDate);
router.post('/getalldate', getAllRecordsbyDate);
router.post('/get', getRecords);

export default router;