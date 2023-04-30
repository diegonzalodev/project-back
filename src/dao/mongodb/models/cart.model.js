const { Schema, model } = require("mongoose");

const collection = "carts";

const cartSchema = new Schema({
  products: [
    {
      id: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

const cartModel = model(collection, cartSchema);

module.exports = {
  cartModel,
};
