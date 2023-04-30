const { cartModel } = require("./models/cart.model");
class CartManagerMongo {
  async createCart() {
    try {
      const newCart = await cartModel.create({ products: [] });
      return newCart.toObject();
    } catch (error) {
      return new Error(error);
    }
  }

  async getCartById(id) {
    try {
      const cart = await cartModel.findById(id).lean();
      return cart;
    } catch (error) {
      return new Error(error);
    }
  }

  async getProductsOfCart(id) {
    try {
      const cart = await cartModel.findById(id).lean();
      return cart ? cart.products : null;
    } catch (error) {
      return new Error(error);
    }
  }

  async saveCart(cart) {
    try {
      const updatedCart = await cartModel
        .findByIdAndUpdate(cart._id, cart, {
          new: true,
        })
        .lean();
      return updatedCart;
    } catch (error) {
      return new Error(error);
    }
  }
}

module.exports = new CartManagerMongo();
