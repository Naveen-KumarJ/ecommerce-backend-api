const express = require("express");
const dotenv = require("dotenv");
const userRouter = require("./routes/user.route.js");
const productRouter = require("./routes/product.route.js");
const cartRouter = require("./routes/cart.route.js");
const couponRouter = require("./routes/coupon.route.js");
const orderRouter = require("./routes/order.route.js");

const mongoose = require("mongoose");
const cors = require("cors");
const authMiddleware = require("./middlewares/authMiddleware.js");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Database Connected Successfully"))
  .catch((error) => console.log("Database Connection Failed ", error));

app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use(authMiddleware);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/coupon", couponRouter);
app.use("/api/v1/order", orderRouter);

app.listen(PORT, console.log(`Server is running on PORT: ${PORT}`));
