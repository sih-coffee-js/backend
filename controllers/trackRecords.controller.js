import locations from "../models/locations.model.js";
import trackrecord from "../models/trackrecord.model.js";
import { errorHandler } from '../utils/error.js';
import { sendUserNotification } from '../utils/pushnotifications.js';

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371
  var dLat = deg2rad(lat2 - lat1);
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180)
}

export const trackRecords = async (req, res, next) => {
  const { userId, longitude, latitude } = req.body;
  if (
    !userId ||
    !longitude ||
    !latitude ||
    userId === '' ||
    longitude === '' ||
    latitude === ''
  ) {
    return next(errorHandler(400, 'All fields are required'));
  }

  try {
    const allLocations = await locations.find();
    for (let loc of allLocations) {
      const distance = getDistanceFromLatLonInKm(latitude, longitude, loc.latitude, loc.longitude);
      const prevRecord = await trackrecord.findOne(
        { user: userId, location: loc._id },
        null,
        { sort: { time: -1 } }
      );
      if (distance <= 0.2) {
        if (!prevRecord || prevRecord.type === 'CheckOut') {
          const newRecord = new trackrecord({ user: userId, location: loc._id, type: "CheckIn" });
          await newRecord.save();
          const time = newRecord.time.toLocaleTimeString();
          sendUserNotification(userId, `Checked In Done at ${loc.name}`, `Time: ${time}`);
          return res.status(200).json({ success: true, result: 'Checked In' });
        }
      } else {
        if (prevRecord && prevRecord.type === 'CheckIn') {
          const newRecord = new trackrecord({ user: userId, location: loc._id, type: "CheckOut" });
          await newRecord.save();
          const time = newRecord.time.toLocaleTimeString();
          sendUserNotification(userId, `Checked Out Done at ${loc.name}`, `Time: ${time}`);
          return res.status(200).json({ success: true, result: 'Checked Out' });
        }
      }
    }
    return res.status(200).json({ success: true, result: 'none' });
  } catch (error) {
    console.log(error);
    next(errorHandler(500, 'Internal Server Error'));
  }
};

export const getRecordsbyDate = async (req, res, next) => {
  const { userId, date } = req.body;
  console.log(req.body);
  if (!userId||!date) {
    return next(errorHandler(400, 'UserId and date is required'));
  }
  try {
    var startDate = new Date(date);

    startDate.setSeconds(0);
    startDate.setHours(0);
    startDate.setMinutes(0);

    var dateMidnight = new Date(startDate);

    dateMidnight.setHours(23);
    dateMidnight.setMinutes(59);
    dateMidnight.setSeconds(59);

    const records = await trackrecord.find({
      user: userId,
      time: {
        $gt: startDate,
        $lt: dateMidnight
      }
    }).populate('location');

    return res.status(200).json(records);

  } catch (e) {
    console.log(e);
    return next(errorHandler(500, 'Internal Error'));
  }
}

export const getRecords = async (req, res, next) => {
  const { userId } = req.body;
  console.log(req.body);
  if (!userId) {
    return next(errorHandler(400, 'UserId and date is required'));
  }
  try {
    const records = await trackrecord.find({
      user: userId,
    }).populate('location');
    return res.status(200).json(records);

  } catch (e) {
    console.log(e);
    return next(errorHandler(500, 'Internal Error'));
  }
}