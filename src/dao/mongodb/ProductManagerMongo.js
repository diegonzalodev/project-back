const { productModel } = require("./models/product.model");

class ProductManagerMongo {
  async addProduct(newProduct) {
    try {
      if (
        !newProduct.title ||
        !newProduct.description ||
        !newProduct.code ||
        !newProduct.price ||
        !newProduct.stock ||
        !newProduct.category
      )
        return { error: "All fields are required" };

      let verifyProduct = await productModel.findOne({ code: newProduct.code });
      if (verifyProduct)
        return { error: "A product with this code already exists" };

      let status =
        newProduct.status === (undefined || " ") ? true : newProduct.status;
      let thumbnail = newProduct.thumbnail || " ";
      const product = new productModel({ ...newProduct, status, thumbnail });
      await product.save();
      return { success: "Product added", payload: product };
    } catch (error) {
      return new Error(error);
    }
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
      const product = await productModel.findById(pid);
      if (!product) return { error: "There is no product with this ID" };
      return product;
    } catch (error) {
      return new Error(error);
    }
  }

  async updateProduct(pid, updatedProduct) {
    try {
      const product = await productModel.findById(pid);
      if (!product) return { error: "There is no product with this ID" };
      Object.assign(product, updatedProduct);
      await product.save();
      return { success: `Product with ID ${pid} updated` };
    } catch (error) {
      return new Error(error);
    }
  }

  async deleteProduct(pid) {
    try {
      const product = await productModel.findByIdAndDelete(pid);
      if (!product) return { error: "There is no product with this ID" };
      return { success: `Product with ID ${pid} deleted` };
    } catch (error) {
      return new Error(error);
    }
  }
}

module.exports = new ProductManagerMongo();
