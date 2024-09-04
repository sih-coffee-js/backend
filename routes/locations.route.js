import express from 'express';
import { addLocations } from '../controllers/locations.controller.js';

const router = express.Router();

router.post('/add', addLocations);

export default router;