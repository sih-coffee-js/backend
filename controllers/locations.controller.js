import locations from "../models/locations.model.js"
import { errorHandler } from '../utils/error.js';
import trackRecord from "../models/trackrecord.model.js";

export const addLocations = async (req, res, next) => {
  const { name, longitude, latitude } = req.body;
  if (
    !name ||
    !longitude ||
    !latitude ||
    name === '' ||
    longitude === '' ||
    latitude === ''
  ) {
    return next(errorHandler(400, 'All fields are required'));
  }

  try {
    const location = new locations({ name, longitude, latitude })
    await location.save();
    res
      .status(200)
      .json({ success: true });
  } catch (error) {
    next(errorHandler(500, 'Internal Server Error'));
  }
};

export const getLocations = async (req, res, next) => {
  try {
    const locationsList = await locations.find();
    let locs = [];

    var startDate = new Date();

    startDate.setSeconds(0);
    startDate.setHours(0);
    startDate.setMinutes(0);

    var dateMidnight = new Date(startDate);

    dateMidnight.setHours(23);
    dateMidnight.setMinutes(59);
    dateMidnight.setSeconds(59);


    for (let i = 0; i < locationsList.length; i++) {
      const locationId = locationsList[i]._id;
      const uniqueUsers = await trackRecord.distinct('user', {
        location: locationId, time: {
          $gt: startDate,
          $lt: dateMidnight
        }
      });

      locs.push({
        location: locationsList[i],
        users: uniqueUsers
      });
    }
    res.status(200).json(locs);
  } catch (error) {
    next(errorHandler(500, 'Internal Server Error'));
  }
};