const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const userModel = require("../models/user.model");
dotenv.config();

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")?.[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "unauthorized",
    });
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(data);
    const user = await userModel.findById(data.id);
    if (user.jwt !== token) throw new Error("unauthorized");
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "unauthorized",
    });
  }
};

module.exports = authMiddleware;
