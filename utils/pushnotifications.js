import { Expo } from 'expo-server-sdk';
import expoToken from '../models/expotoken.model.js';

let expo = new Expo({
    accessToken: process.env.EXPO_ACCESS_TOKEN,
    useFcmV1: true
});

export const sendNotification = async (expoPushToken, data) => {
    const chunks = expo.chunkPushNotifications([{ to: expoPushToken, ...data }]);
    const tickets = [];

    for (const chunk of chunks) {
        try {
            const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            tickets.push(...ticketChunk);
        } catch (error) {
            console.error(error);
        }
    }

    let response = "";

    for (const ticket of tickets) {
        if (ticket.status === "error") {
            if (ticket.details && ticket.details.error === "DeviceNotRegistered") {
                response = "DeviceNotRegistered";
            }
        }

        if (ticket.status === "ok") {
            response = ticket.id;
        }
    }

    return response;
}

export const sendUserNotification = async (userId, title, body) => {
    try {
        const users = await expoToken.find({ user: userId });
        for (let user of users) {
            const res=sendNotification(user.token, {
                "sound": "default",
                "title": title,
                "body": body
            });
            if(res==="DeviceNotRegistered") {
                await expoToken.deleteOne({ token:user.token });
            }
        }
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

export const getReceipt = async (receiptId) => {
    let receiptIdChunks = expo.chunkPushNotificationReceiptIds([receiptId]);

    let receipt;

    for (const chunk of receiptIdChunks) {
        try {
            receipt = await expo.getPushNotificationReceiptsAsync(chunk);
        } catch (error) {
            console.error(error);
        }
    }

    return receipt ? receipt[receiptId] : null;
}