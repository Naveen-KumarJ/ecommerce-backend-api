const express = require("express");
const router = express.Router();
const { placeOrder } = require("../controllers/order.controller");

router.post("/place", placeOrder);

module.exports = router;
