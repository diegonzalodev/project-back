let products = [];
import fs from "fs";

export class ProductManager {
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

// const product = new ProductManager("./products.json");

// product.addProduct({
//   title: "Product 1",
//   description: "This is product 1",
//   price: 200,
//   thumbnail: "No image",
//   code: "001",
//   stock: 25,
// });
// product.addProduct({
//   title: "Product 2",
//   description: "This is product 2",
//   price: 200,
//   thumbnail: "No image",
//   code: "002",
//   stock: 25,
// });
// product.addProduct({
//   title: "Product 3",
//   description: "This is product 3",
//   price: 200,
//   thumbnail: "No image",
//   code: "003",
//   stock: 25,
// });
// product.addProduct({
//   title: "Product 4",
//   description: "This is product 4",
//   price: 200,
//   thumbnail: "No image",
//   code: "004",
//   stock: 25,
// });
// product.addProduct({
//   title: "Product 5",
//   description: "This is product 5",
//   price: 200,
//   thumbnail: "No image",
//   code: "005",
//   stock: 25,
// });
// product.addProduct({
//   title: "Product 6",
//   description: "This is product 6",
//   price: 200,
//   thumbnail: "No image",
//   code: "006",
//   stock: 25,
// });
// product.addProduct({
//   title: "Product 7",
//   description: "This is product 7",
//   price: 200,
//   thumbnail: "No image",
//   code: "007",
//   stock: 25,
// });
// product.addProduct({
//   title: "Product 8",
//   description: "This is product 8",
//   price: 200,
//   thumbnail: "No image",
//   code: "008",
//   stock: 25,
// });
// product.addProduct({
//   title: "Product 9",
//   description: "This is product 9",
//   price: 200,
//   thumbnail: "No image",
//   code: "009",
//   stock: 25,
// });
// product.addProduct({
//   title: "Product 10",
//   description: "This is product 10",
//   price: 200,
//   thumbnail: "No image",
//   code: "010",
//   stock: 25,
// });
