const express = require("express");
const router = express.Router();
const {
  listProducts,
  createProduct,
} = require("../controllers/product.controller.js");
const authorizer = require("../middlewares/rbac.js");

router.get("/list", listProducts);
router.post("/create", authorizer(["SELLER", "ADMIN"]), createProduct);

module.exports = router;
