let products = [];
const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.products = products;
    this.path = path;
  }

  addProduct = async (newProduct) => {
    this.getProducts();
    try {
      if (
        !newProduct.title ||
        !newProduct.description ||
        !newProduct.price ||
        !newProduct.thumbnail ||
        !newProduct.code ||
        !newProduct.stock
      )
        return "All fields are required";

      let verifyProduct = this.products.find(
        (prod) => prod.code === newProduct.code
      );
      if (verifyProduct) return "A product with this code already exists";
      if (this.products.length === 0) {
        return this.products.push({ id: 1, ...newProduct });
      }
      this.products.push({
        id: this.products[this.products.length - 1].id + 1,
        ...newProduct,
      });
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.products, "utf-8", "\t")
      );
    } catch (error) {
      return error;
    }
  };

  getProducts = async () => {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      this.products = JSON.parse(data);
      return this.products;
    } catch (error) {
      return error;
    }
  };

  getProductById = async (id) => {
    this.getProducts();
    let productId = this.products.find((prod) => prod.id === id);
    if (!productId) return "Not found";
    return productId;
  };

  updateProduct = async (id, fields) => {
    try {
      const findProduct = this.products.find((prod) => prod.id === id);
      if (!findProduct) return "There is no product with this ID";
      findProduct.title = fields.title;
      findProduct.description = fields.description;
      findProduct.price = fields.price;
      findProduct.thumbnail = fields.thumbnail;
      findProduct.stock = fields.stock;
      findProduct.code = fields.code;
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.products, "utf-8", "\t")
      );
      return "Updated Product";
    } catch (error) {
      return error;
    }
  };

  deleteProduct = async (id) => {
    try {
      const filteredProducts = this.products.filter((prod) => prod.id !== id);
      if (filteredProducts.length === products.length) return "Incorrect ID";
      if (filteredProducts.length === 0) return "There are no products";
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(filteredProducts, "utf-8", "\t")
      );
      return filteredProducts;
    } catch (error) {
      return error;
    }
  };
}

const product = new ProductManager("./products.json");

const tests = async () => {
  console.log("ADD PRODUCT");
  console.log(
    await product.addProduct({
      title: "Product 1",
      description: "This is product 1",
      price: 200,
      thumbnail: "No image",
      code: "001",
      stock: 25,
    })
  );
  console.log(
    await product.addProduct({
      title: "Product 2",
      description: "This is product 2",
      price: 200,
      thumbnail: "No image",
      code: "002",
      stock: 25,
    })
  );
  console.log(
    await product.addProduct({
      title: "Product 3",
      description: "This is product 3",
      price: 200,
      thumbnail: "No image",
      code: "003",
      stock: 25,
    })
  );
  console.log(
    await product.addProduct({
      title: "Product 4",
      description: "This is product 4",
      price: 200,
      thumbnail: "No image",
      code: "004",
      stock: 25,
    })
  );
  console.log("----------------------------------------");
  console.log("INCOMPLETE FIELDS");
  console.log(await product.addProduct({ title: "Product 4" }));
  console.log("----------------------------------------");
  console.log("GET ALL PRODUCTS");
  console.log(await product.getProducts());
  console.log("----------------------------------------");
  // UPDATE PRODUCT
  console.log(
    await product.updateProduct(2, {
      title: "Updated Product 2",
      description: "Modified description",
      price: 500,
      thumbnail: "No image",
      stock: 300,
      code: "015",
    })
  );
  console.log("----------------------------------------");
  console.log("GET ALL PRODUCTS");
  console.log(await product.getProducts());
  console.log("----------------------------------------");
  console.log("DELETE PRODUCT");
  console.log(await product.deleteProduct(3));
};

tests();
