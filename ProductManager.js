let products = [];

class ProductManager {
  constructor() {
    this.products = products;
  }

  addProduct(newProduct) {
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

    return this.products.push({
      id: this.products[this.products.length - 1].id + 1,
      ...newProduct,
    });
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    let productId = this.products.find((prod) => prod.id === id);

    if (!productId) return "Not found";

    return productId;
  }
}

const product = new ProductManager();

product.addProduct({
  title: "Product 1",
  description: "This is product 1",
  price: 200,
  thumbnail: "No image",
  code: "001",
  stock: 25,
});
console.log(product.addProduct({ title: "Product 3" }));
console.log("----------------------------------------");
console.log(product.getProducts());
console.log("----------------------------------------");
console.log(
  product.addProduct({
    title: "Product 1",
    description: "This is product 1",
    price: 200,
    thumbnail: "No image",
    code: "001",
    stock: 25,
  })
);
console.log("----------------------------------------");
console.log(product.getProductById(1));
console.log("----------------------------------------");
console.log(product.getProductById(3));
