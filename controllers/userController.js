const User = require("../models/userModel");
const JWT = require("jsonwebtoken");
const catchAsync = require("./../utils/catchAsync");
const appError = require("./../utils/appError");

exports.signup = catchAsync(async (req, res, next) => {
  const { userName, userEmail, userPass } = req.body;

  // Check if the email is already registered
  const existingUser = await User.findOne({ userEmail });
  if (existingUser) {
    return next(
      new appError(400, "Failed", "This email is already registered")
    );
  }

  // Create new user
  const newUser = await User.create({
    userName,
    userEmail,
    userPass,
  });

  res.status(201).json({
    Status: "Success",
    Message: "User created successfully",
    newUser,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { userEmail, userPass } = req.body;

  // Check if the user exists
  const findUser = await User.findOne({ userEmail });
  if (!findUser) {
    return res.status(400).json({
      Status: "Failed",
      Message: "Account doesn't exist. Please sign up first.",
    });
  }

  // Verify password
  if (findUser.userPass != userPass) {
    return res.status(401).json({
      Status: "Failed",
      Message: "Invalid Credentials",
    });
  }

  // Generate token
  const token = JWT.sign({ id: findUser._id }, `${process.env.JWT_SECRET}`, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  // Set cookie options
  const cookieOptions = {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    sameSite: "Lax",
  };

  // Send cookie and response
  res.cookie("jwt", token, cookieOptions);
  return res.status(200).json({
    Status: "Success",
    Message: "Successfully logged in",
    user: findUser,
    token,
  });
});

exports.logout = catchAsync((req, res, next) => {
  // Clear the JWT cookie
  res.cookie("jwt", "", {
    maxAge: 0, // Expire immediately
    httpOnly: process.env.NODE_ENV === "production",
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    path: "/", // Match the path used when setting the cookie
  });

  res.status(200).json({
    Status: "Success",
    Message: "Successfully logged out",
  });
});
