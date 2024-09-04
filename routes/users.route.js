import express from 'express';
import { getAllUsers } from '../controllers/users.controller.js'; // Adjust the path as needed

const router = express.Router();

router.get('/', getAllUsers);

export default router;
