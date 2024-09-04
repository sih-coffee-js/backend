import locations from "../models/locations.model.js"
import { errorHandler } from '../utils/error.js';

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
    const location = new locations({name,longitude,latitude})
    await location.save();
    res
      .status(200)
      .json({ success: true });
  } catch (error) {
    next(errorHandler(500, 'Internal Server Error'));
  }
};