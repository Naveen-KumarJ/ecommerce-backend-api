const express = require("express");
const dotenv = require("dotenv");
const userRouter = require("./routes/user.route.js");
const productRouter = require("./routes/product.route.js");
const cartRouter = require("./routes/cart.route.js");
const couponRouter = require("./routes/coupon.route.js");
const orderRouter = require("./routes/order.route.js");
const path = require("path");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
const cors = require("cors");
const authMiddleware = require("./middlewares/authMiddleware.js");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Database Connected Successfully"))

  .catch((error) => console.log("Database Connection Failed ", error));

app.use("/api/v1/user", userRouter);
app.use(authMiddleware);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/coupon", couponRouter);
app.use("/api/v1/order", orderRouter);

app.post("/create-order", async (req, res) => {
  try {
    const RazorPay = require("razorpay");

    const razorpay = new RazorPay({
      key_id: process.env.RAZOR_PAY_KEY_ID,
      key_secret: process.env.RAZOR_PAY_KEY_SECRET,
    });

    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    });

    res.json(order);
  } catch (err) {
    console.error("Razorpay Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to create Razorpay order" });
  }
});

app.get("/get-razorpay-key", (req, res) => {
  res.json({ key: process.env.RAZOR_PAY_KEY_ID });
});

app.listen(PORT, console.log(`Server is running on PORT: ${PORT}`));
