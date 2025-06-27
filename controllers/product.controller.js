const productModel = require("../models/product.model");

const listProducts = async (req, res) => {
  const searchKey = req.query.searchKey || "";
  const pageSize = req.query.pageSize || 5;
  const pageNo = req.query.pageNo || 1;

  const itemsToSkip = (pageNo - 1) * pageSize;

  const findQuery = {
    $or: [
      {
        title: new RegExp(searchKey, "gi"),
      },
      {
        description: new RegExp(searchKey, "gi"),
      },
    ],
  };

  const totalItems = await productModel.find(findQuery).countDocuments();

  const products = await productModel
    .find(findQuery)
    .skip(itemsToSkip)
    .limit(pageSize);

  res.json({
    success: true,
    message: "Products List API",
    totalItems,
    products,
  });
};

const createProduct = async (req, res) => {
  const product = await productModel.create(req.body);
  res.json({
    success: true,
    message: "Dummy Create Product API",
    productId: product._id,
  });
};

const productController = {
  listProducts,
  createProduct,
};

module.exports = productController;
