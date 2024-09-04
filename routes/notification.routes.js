import express from "express";
import { sendNotificationbyToken, registerDevice, unregisterDevice, sendNotificationbyUser, sendNotificationbyUsers, sendNotifications, findRegisteredDevices } from '../controllers/notification.controller.js'

const router=express.Router();

router.post('/send',sendNotificationbyToken);
router.post('/register',registerDevice);
router.post('/unregister',unregisterDevice);
router.post('/senduser',sendNotificationbyUser);
router.post('/sendusers',sendNotificationbyUsers);
router.post('/find',findRegisteredDevices);
router.post('/sendall',sendNotifications);

export default router;