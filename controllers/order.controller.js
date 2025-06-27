const cartModel = require("../models/cart.model");
const couponModel = require("../models/coupon.model");
const orderModel = require("../models/order.model");
const productModel = require("../models/product.model");
const dayjs = require("dayjs");
var isBetween = require("dayjs/plugin/isBetween");
dayjs.extend(isBetween);

const placeOrder = async (req, res) => {
  // Checking User Cart is available or Not
  const userCart = await cartModel
    .findOne({ userId: req.user._id })
    .populate("products.productId");
  if (!userCart) {
    return res.status(400).json({
      success: false,
      message:
        "User Cart Not Found. Please Add Items to Cart Before Placing Order",
    });
  }

  // Check Product Stocks is Available or Not
  const productsAvailable = userCart.products.every(
    (p) => p.productId.stock >= p.qty
  );
  if (!productsAvailable) {
    return res.status(400).json({
      success: false,
      message:
        "Products is Not available to you required Quantity. Please Check Before Placing Order",
    });
  }

  const totalPrice = userCart.products.reduce(
    (acc, cv) => acc + cv.productId.price * cv.qty,
    0
  );
  console.log(totalPrice);

  let finalDiscount = 0;
  if (req.body.coupon) {
    const coupon = await couponModel.findOne({ code: req.body.coupon });
    if (!coupon) {
      res.status(400).json({
        success: false,
        message: "Invalid Coupon",
      });
    }

    if (totalPrice < coupon.minOrderValue) {
      res.status(400).json({
        success: false,
        message: "Min order value condition doesn't satisfied",
      });
    }

    const startDate = coupon.startDate;
    const endDate = coupon.endDate;
    const currentData = dayjs();
    const isCurrentDateBetween = currentData.isBetween(startDate, endDate);
    if (!isCurrentDateBetween) {
      res.status(400).json({
        success: false,
        message: "Coupon Invalid. Date Exceeded!",
      });
    }

    const discountPrice = (totalPrice * coupon.discountPercentage) / 100;
    finalDiscount = Math.min(discountPrice, coupon.maxDiscountValue);
  }
  const grandTotal = totalPrice - finalDiscount;

  for (let product of userCart.products) {
    await productModel.findByIdAndUpdate(product.productId, {
      $inc: {
        stock: -product.qty,
      },
    });
  }

  if (req.body.paymentMode === "ONLINE") {
  }

  await orderModel.create({
    products: userCart.products,
    coupon: req.body.coupon,
    user: req.user._id,
    modeOfPayment: req.body.paymentMode,
    orderTotal: grandTotal,
    orderStatus:
      req.body.paymentMode === "ONLINE" ? "PAYMENT_PENDING" : "IN_TRANSIT",
    deliveryAddress: req.user.address,
  });

  await cartModel.findByIdAndDelete(userCart._id);

  res.json({
    success: true,
    message: "Order Placed Successfully",
  });
};
const orderController = {
  placeOrder,
};
module.exports = orderController;
