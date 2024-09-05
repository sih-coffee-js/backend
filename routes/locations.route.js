import express from 'express';
import { addLocations, getLocations, PresentAtLocations } from '../controllers/locations.controller.js';

const router = express.Router();

router.post('/add', addLocations);
router.get('/get', getLocations);
router.post('/present', PresentAtLocations);

export default router;