const express = require("express");
const {
  createCoupon,
  listCoupons,
} = require("../controllers/coupon.controller");
const authorizer = require("../middlewares/rbac");

const router = express.Router();

router.post("/create", authorizer(["SELLER", "ADMIN"]), createCoupon);
router.get("/list", listCoupons);

module.exports = router;
