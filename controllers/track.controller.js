import trackRecord from '../models/trackrecord.model.js';
import User from '../models/user.model.js';
import locations from '../models/locations.model.js';

export const getTrackRecords = async (req, res) => {
  try {
    const records = await trackRecord.find()
      .populate('user', 'fullName') 
      .populate('location', 'name'); 

    const output = records.map(record => ({
      userId: record.user._id,
      userName: record.user.fullName,
      location: record.location.name,
      type: record.type,
      time: record.time
    }));

    res.status(200).json(output);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
