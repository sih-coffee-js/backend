import express from 'express';
import {getUser, google, signin, signup } from '../controllers/auth.controller.js';
import { isLoggedIn } from '../middlewares/authorisation.js';

const router = express.Router();


router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google', google);
router.get('/getuser',isLoggedIn,getUser);

export default router;