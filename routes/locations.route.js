import express from 'express';
import { addLocations, getLocations } from '../controllers/locations.controller.js';

const router = express.Router();

router.post('/add', addLocations);
router.get('/get', getLocations);

export default router;