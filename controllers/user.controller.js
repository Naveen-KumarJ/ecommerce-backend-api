const bcrypt = require("bcrypt");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const register = async (req, res) => {
  console.log(req.body);
  await userModel.create(req.body);

  res.json({
    success: true,
    message: "User Registered Successfully",
  });
};

const login = async (req, res) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User Not Found!. Create or Register Account",
    });
  }
  const isPasswordMatched = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isPasswordMatched) {
    return res.status(400).json({
      success: false,
      message: "Incorrect Password",
    });
  }

  const jwtData = {
    id: user._id,
    email: user.email,
  };

  const token = jwt.sign(jwtData, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });

  await userModel.findByIdAndUpdate(user._id, {
    $set: {
      jwt: token,
    },
  });

  res.json({
    success: true,
    message: "User LoggedIn Successfully",
    token,
  });
};

const forgotPassword = async (req, res) => {
  res.json({
    success: true,
    message: "Forgot Password API called!",
  });
};

const resetPassword = async (req, res) => {
  res.json({
    success: true,
    message: "Reset Password Done",
  });
};

const userController = {
  register,
  login,
  forgotPassword,
  resetPassword,
};

module.exports = userController;
