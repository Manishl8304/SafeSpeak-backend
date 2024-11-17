const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "UserName is required"],
    unique: true,
  },
  userEmail: {
    type: String,
    required: [true, "UserEmail is required"],
    unique: true,
    validate: [validator.isEmail, "Email provided is not valid"],
  },
  userPass: {
    type: String,
    required: [true, "Password is required"],
    minlength: 8,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
