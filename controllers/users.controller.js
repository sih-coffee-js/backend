import User from '../models/user.model.js';
import trackRecord from '../models/trackrecord.model.js';

function calculateWorkingHours(data) {
  const checkIns = data.filter(event => event.type === 'CheckIn').sort((a, b) => new Date(a.time) - new Date(b.time));
  const checkOuts = data.filter(event => event.type === 'CheckOut').sort((a, b) => new Date(a.time) - new Date(b.time));

  if (checkIns.length > checkOuts.length) {
    const lastCheckInDate = new Date(checkIns[checkIns.length - 1].time);
    const currentDate = new Date();
    if (
      lastCheckInDate.getFullYear() !== currentDate.getFullYear() ||
      lastCheckInDate.getMonth() !== currentDate.getMonth() ||
      lastCheckInDate.getDate() !== currentDate.getDate()
    ) {
      const endOfDay = new Date(lastCheckInDate);
      endOfDay.setHours(23, 59, 59, 999);
      checkOuts.push({
        time: endOfDay.toISOString()
      });
    } else {
      checkOuts.push({
        time: currentDate.toISOString()
      });
    }
  }

  let totalWorkingMilliseconds = 0;

  for (let i = 0; i < checkIns.length && i < checkOuts.length; i++) {
    const checkInTime = new Date(checkIns[i].time).getTime();
    const checkOutTime = new Date(checkOuts[i].time).getTime();

    if (checkOutTime > checkInTime) {
      totalWorkingMilliseconds += checkOutTime - checkInTime;
    }
  }

  const totalWorkingHours = Math.floor(totalWorkingMilliseconds / (1000 * 60 * 60));
  const totalWorkingMinutes = Math.floor((totalWorkingMilliseconds % (1000 * 60 * 60)) / (1000 * 60));

  return totalWorkingHours.toString() + ':' + (totalWorkingMinutes <= 9 ? `0${totalWorkingMinutes.toString()}` : totalWorkingMinutes.toString())
}

export const getAllUsers = async (req, res) => {
  try {
    let users = await User.find({ role: "User" });
    var startDate = new Date();

    startDate.setSeconds(0);
    startDate.setHours(0);
    startDate.setMinutes(0);

    var dateMidnight = new Date(startDate);

    dateMidnight.setHours(23);
    dateMidnight.setMinutes(59);
    dateMidnight.setSeconds(59);

    // Convert users to plain objects before modifying
    let modifiedUsers = [];

    for (let i = 0; i < users.length; i++) {
      const todaysRec = await trackRecord.find({
        user: users[i]._id,
        time: {
          $gt: startDate,
          $lt: dateMidnight
        }
      });

      let userObj = users[i].toObject();

      if (todaysRec.length > 0) {
        userObj['working'] = calculateWorkingHours(todaysRec);
      } else {
        userObj['working'] = '0:00';
      }

      modifiedUsers.push(userObj);
    }

    res.status(200).json(modifiedUsers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

