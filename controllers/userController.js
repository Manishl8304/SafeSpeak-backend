const User = require("../models/userModel");
const JWT = require("jsonwebtoken");

// exports.getUserDetail = async (req, res, next) => {
//   try {
//     const { userEmail } = req.body;
//     const existingUser = await User.findOne({ userEmail });
//     res.status(200).json({
//       Status: "Success",
//       Message: "User Found successfully",
//       existingUser,
//     });
//   } catch (err) {}
// };
exports.signup = async (req, res, next) => {
  try {
    const { userName, userEmail, userPass } = req.body;

    const existingUser = await User.findOne({ userEmail });
    if (existingUser) {
      return res.status(400).json({
        Status: "Failed",
        Message: "Email already in use. Please log in.",
      });
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
  } catch (err) {
    res.status(400).json({
      Status: "Failed",
      Message: "Signup failed",
      error: err,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { userEmail, userPass } = req.body;

    const findUser = await User.findOne({ userEmail });
    if (!findUser) {
      return res.status(400).json({
        Status: "Failed",
        Message: "Account doesn't exist. Please sign up first.",
      });
    }

    if (findUser.userPass != userPass) {
      return res.status(400).json({
        Status: "Failed",
        Message: "Invalid Credentials",
      });
    }

    const token = JWT.sign(
      { userEmail, userName: findUser.userName },
      `${process.env.JWT_SECRET}`,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    const cookieOptions = {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      secure: process.env.NODE_ENV === "production", // Set to true in production
      httpOnly: process.env.NODE_ENV === "production", // Secure the cookie against client-side access
      sameSite: "Lax",
      path: "/",
    };

    res.cookie("jwt", token, cookieOptions);
    return res.status(200).json({
      Status: "Success",
      Message: "Successfully logged in",
      user: { userEmail: findUser.userEmail, userName: findUser.userName },
      token,
    });
  } catch (err) {
    res.status(400).json({
      Status: "Failed",
      Message: "Login failed",
      error: err,
    });
  }
};
