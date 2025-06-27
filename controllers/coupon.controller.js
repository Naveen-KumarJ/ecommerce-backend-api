const couponModel = require("../models/coupon.model");
const createCoupon = async (req, res) => {
  await couponModel.create(req.body);
  res.json({
    success: true,
    message: "Coupon Created Successfully",
  });
};

const listCoupons = async (req, res) => {
  const coupons = await couponModel.find();
  res.json({
    success: true,
    message: "List Coupons API",
    data: coupons,
  });
};

const couponController = {
  createCoupon,
  listCoupons,
};
module.exports = couponController;
