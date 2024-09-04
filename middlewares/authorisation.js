import jwt from 'jsonwebtoken';
import User from "../models/user.model.js";

export const isLoggedIn = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(403).json({
      success: false,
      message: "Login First to access this page",
    });
  }
  else {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findOne({
        _id: decoded.user._id
      })
      next();
    } catch (err) {
      console.log(err,"ddd");
      res.status(403).json({
        success:false, 
        message: "Invalid token." });
    }
  }
}