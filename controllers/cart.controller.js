const cartModel = require("../models/cart.model");

const addToCart = async (req, res) => {
  const cart = await cartModel.findOne({ userId: req.user._id });

  if (!cart) {
    const cartData = {
      userId: req.user._id,
      products: [
        {
          productId: req.body.productId,
          qty: req.body.qty,
        },
      ],
    };

    await cartModel.create(cartData);
  } else {
    const productIndex = cart.products.findIndex(
      (product) => product.productId == req.body.productId
    );

    if (productIndex > -1) {
      const newQty = cart.products[productIndex].qty + req.body.qty;

      if (newQty <= 0) {
        await cartModel.findByIdAndUpdate(cart._id, {
          $pull: {
            products: {
              productId: req.body.productId,
            },
          },
        });
      } else {
        cart.products[productIndex].qty += req.body.qty;
        await cart.save();
      }
    } else {
      cart.products.push({
        productId: req.body.productId,
        qty: req.body.qty,
      });
      await cart.save();
      // await cartModel.findByIdAndUpdate(cart._id, {
      //   $push: {
      //     products: {
      //       productId: req.body.productId,
      //       qty: req.body.qty,
      //     },
      //   },
      // });
    }
  }

  res.json({
    success: true,
    message: "Cart Updated Successfully",
  });
};

const getCart = async (req, res) => {
  const cartInfo = await cartModel.findOne({
    userId: req.user._id,
  }).populate('products.productId');
  res.json({
    success: true,
    message: "Cart Details API",
    data: cartInfo,
  });
};
const cartController = {
  addToCart,
  getCart,
};
module.exports = cartController;
