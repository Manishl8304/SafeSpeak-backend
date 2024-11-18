const User = require("../models/userModel");
const JWT = require("jsonwebtoken");
const catchAsync = require("./../utils/catchAsync");
const appError = require("./../utils/appError");

exports.signup = catchAsync(async (req, res, next) => {
  const { userName, userEmail, userPass } = req.body;

  const existingUser = await User.findOne({ userEmail });
  if (existingUser) {
    return next(
      new appError(400, "Failed", "This email is already registered")
    );
  }

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
  console.log("User Email: ", userEmail);

  const findUser = await User.findOne({ userEmail });
  if (!findUser) {
    return res.status(400).json({
      Status: "Failed",
      Message: "Account doesn't exist. Please sign up first.",
    });
  }

  if (findUser.userPass != userPass) {
    return res.status(401).json({
      Status: "Failed",
      Message: "Invalid Credentials",
    });
  }

  const token = JWT.sign({ id: findUser._id }, `${process.env.JWT_SECRET}`, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const cookieOptions = {
    maxAge: 24 * 60 * 60 * 1000,
    secure: true, 
    httpOnly: true,
    sameSite: "None",
  };

  console.log("Cookie Options: ", cookieOptions);

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

exports.protect = catchAsync(async (req, res, next) => {
  let token = req.cookies.jwt;
  if (!token) {
    return next(
      new appError(401, "Failed", "You are not logged in. Please log in first!")
    );
  }
  const decoded = JWT.verify(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new appError(
        401,
        "Failed",
        "The user belonging to this token does not exist."
      )
    );
  }

  req.user = currentUser;
  next();
});
