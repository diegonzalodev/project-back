const { productModel } = require("./models/product.model");

class ProductManagerMongo {
  async addProduct() {
    try {
    } catch (error) {}
  }
  async getProducts() {
    try {
      return await productModel.find({});
    } catch (err) {
      return new Error(err);
    }
  }
  async getProductById(pid) {
    try {
    } catch (error) {}
  }
  async updateProduct(pid) {
    try {
    } catch (error) {}
  }
  async deleteProduct(pid) {
    try {
    } catch (error) {}
  }
}

module.exports = new ProductManagerMongo();
