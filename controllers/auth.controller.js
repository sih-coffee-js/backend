import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
  const { fullName, email, phoneNo, password } = req.body;
  if (
    !email ||
    !phoneNo ||
    !password ||
    !fullName ||
    email === '' ||
    password === '' ||
    fullName === ''
  ) {
    return next(errorHandler(400, 'All fields are required'));
  }
  const checkUser = await User.findOne({ email });
  if (checkUser) {
    return next(errorHandler(404, 'User already registered'));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    fullName,
    email,
    phoneNo,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    const token = jwt.sign(
      { user: newUser },
      process.env.JWT_SECRET
    );
    const { password, ...rest } = newUser._doc;
    res
      .status(200)
      .json({ ...rest, token, success: true });
  } catch (error) {
    next(errorHandler(500, 'Internal Server Error'));
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);
  if (!email || !password || email === '' || password === '') {
    return next(errorHandler(400, 'All fields are required'));
  }

  try {
    const validUser = await User.findOne({ email });
    console.log(password);
    if (!validUser) {
      return next(errorHandler(404, 'User not found'));
    }
    if(validUser.isGoogleSignin) {
      return next(errorHandler(400, 'This Account is registered with Google signin'));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, 'Invalid password'));
    }
    const token = jwt.sign(
      { user: validUser },
      process.env.JWT_SECRET
    );

    const { password: pass, ...rest } = validUser._doc;

    res
      .status(200)
      .json({ ...rest, token, success: true });
  } catch (error) {
    // next(error);
    console.log(error);
    next(errorHandler(500, 'Internal Server Error'));
  }
};

export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;

  if (!email || !name || email === '' || name === '') {
    return next(errorHandler(400, 'All fields are required'));
  }

  try {
    const user = await User.findOne({ email });

    if (user) {
      if(!user.isGoogleSignin) {
        return next(errorHandler(400, 'This Account is not registered with Google signin'));
      }
      const password = email + 'GeoTrackOAuthUser'
      const validPassword = bcryptjs.compareSync(password, user.password);
      if (validPassword) {
        const token = jwt.sign(
          { user },
          process.env.JWT_SECRET
        );
        const { password, ...rest } = user._doc;
        return res
          .status(200)
          .json({ ...rest, token, success: true });
      }
      else {
        return next(errorHandler(400, 'Invalid credentials'));
      }
    } else {
      const generatedPassword = email + 'GeoTrackOAuthUser'
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      const newUser = new User({
        fullName:name,
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
        isGoogleSignin:true
      });

      await newUser.save();
      const token = jwt.sign(
        { user: newUser },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = newUser._doc;
      return res
        .status(200)
        .json({ ...rest, token, success: true });
    }
  } catch (error) {
    next(errorHandler(500, 'Internal Server Error'));

  }
};


export const getUser = async (req, res, next) => {
  try {
  const { password, ...restOfUser } = req.user;
  const userResponseData = {
    ...restOfUser,
  };
  res.status(200).json({ success: true, user: userResponseData });
  }
  catch (err) {
    console.log(err);
  }
}
