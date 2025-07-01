const bcrypt = require("bcrypt");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const register = async (req, res) => {
  try {
    const { email, password, ...rest } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const user = await userModel.create({
      email,
      password,
      ...rest,
    });

    res.json({
      success: true,
      message: "User Registered Successfully",
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong during registration",
    });
  }
};

const login = async (req, res) => {
  const user = await userModel.findOne({ email: req.body.email.toLowerCase() });
  console.log(req.body.email);
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
  console.log(isPasswordMatched);
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

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Both current and new passwords are required",
      });
    }

    const user = req.user;

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password Changed Successfully",
    });
  } catch (error) {
    console.error("Change Password Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const userController = {
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
};

module.exports = userController;
