import { sendNotification } from '../utils/pushnotifications.js'
import User from '../models/user.model.js';
import expoToken from '../models/expotoken.model.js';

export const sendNotificationbyToken = async (req, res) => {
    const { token, message } = req.body;
    try {
        const response = await sendNotification(token, message);
        if (response == "DeviceNotRegistered") {
            const result = await expoToken.deleteOne({ token });
            if (result.deletedCount === 1) {
                return res.json({ message: "Device is not registered" })
            } else {
                return res.json({ message: "Device is not registered and Unable to remove Device" })
            }
        }
        return res.json({ response });
    }
    catch (error) {
        console.log(error);
        return res.json({ message: error });
    }
}

export const registerDevice = async (req, res) => {
    const { userId, token } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.json({ status: false, message: "User not found" });
        }
        const previous_token = await expoToken.findOne({ token: token });
        if (previous_token) {
            if (previous_token.user.toString() == userId) {
                return res.json({ status: true, message: "Device Already Registered" })
            }
            previous_token.user = userId;
            await previous_token.save();
            return res.json({ status: true, message: "Device Registered" })
        }
        const new_token = new expoToken({ user: userId, token: token })
        await new_token.save();
        return res.json({ status: true, message: "Device Registered" })
    }
    catch (error) {
        console.log(error);
        return res.json({ status: false, message: error });
    }
}

export const unregisterDevice = async (req, res) => {
    const { token } = req.body;
    try {
        const result = await expoToken.deleteOne({ token });
        if (result.deletedCount === 1) {
            return res.json({ status: true, message: "Device Unregistered" })
        }
        return res.json({ status: false, message: "unable to Unregister device" })
    }
    catch (error) {
        console.log(error);
        return res.json({ status: false, message: error });
    }
}

export const sendNotificationbyUser = async (req, res) => {
    const { userId, message } = req.body;
    try {
        let responses = {};
        responses['success'] = 0;
        responses['failed'] = 0;
        const users = await expoToken.find({ user: userId });
        if (!users || users.length == 0) {
            return res.json({ status: false, message: "No Registered users found in expo push notifications" });
        }
        for (let user of users) {
            const response = await sendNotification(user.token, message);
            if (response == "DeviceNotRegistered") {
                const result = await expoToken.deleteOne({ token:user.token });
                responses['failed'] += 1;
                continue;
            }
            responses['success'] += 1;
        }
        return res.json({ status: true, success: responses['success'], failed: responses['failed'], total: responses['total'] });
    }
    catch (error) {
        console.log(error);
        return res.json({ status: false, message: error });
    }
}

export const findRegisteredDevices = async (req, res) => {
    const { userId } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user || user.role != 'Admin') {
            return res.json({ status: false, message: "Permission denied" });
        }
        const users = await expoToken.find().populate('user');
        return res.json({ status: true, users });
    } catch (error) {
        console.log(error);
        return res.json({ status: false, message: error });
    }
}

export const sendNotifications = async (req, res) => {
    const { userId, message } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user || user.role != 'Admin') {
            return res.json({ status: false, message: "Permission denied" });
        }
        let responses = {};
        responses['success'] = 0;
        responses['failed'] = 0;
        const users = await expoToken.find();
        for (let user of users) {
            const response = await sendNotification(user.token, message);
            if (response == "DeviceNotRegistered") {
                const result = await expoToken.deleteOne({ token:user.token });
                responses['failed'] += 1;
                continue;
            }
            responses['success'] += 1;
        }
        return res.json({ status: true, success: responses['success'], failed: responses['failed'], total: responses['total'] });
    } catch (error) {
        console.log(error);
        return res.json({ status: false, message: error });
    }
}

export const sendNotificationbyUsers = async (req, res) => {
    const { userId, usersId, message } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user || user.role != 'Admin') {
            return res.json({ status: false, message: "Permission denied" });
        }
        let responses = {};
        responses['success'] = 0;
        responses['failed'] = 0;
        for (let userid of usersId) {
            const users = await expoToken.find({user:userid});
            if(users&&users.length>0) {
                for (let user of users) {
                    const response = await sendNotification(user.token, message);
                    if (response == "DeviceNotRegistered") {
                        const result = await expoToken.deleteOne({ token:user.token });
                        responses['failed'] += 1;
                        continue;
                    }
                    responses['success'] += 1;
                }
            }
        }
        return res.json({ status: true, success: responses['success'], failed: responses['failed'], total: responses['total'] });
    } catch (error) {
        console.log(error);
        return res.json({ status: false, message: error });
    }
}

