import express from "express";
import { ProductManager } from "./ProductManager.js";

const product = new ProductManager("./products.json");
const app = express();

app.get(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("App is running");
});

app.get("/products", async (req, res) => {
  try {
    const arrayProducts = await product.getProducts();
    let { limit } = req.query;
    limit = parseInt(limit);

    if (!limit || limit <= 0 || limit > arrayProducts.length)
      return res.send(arrayProducts);

    res.send(arrayProducts.slice(0, limit));
  } catch (error) {
    console.log(error);
    res.send({ error: "Internal server error" });
  }
});

app.get("/products/:pid", async (req, res) => {
  try {
    const arrayProducts = await product.getProducts();
    const findByIdProduct = arrayProducts.find(
      (prod) => prod.id === Number(req.params.pid)
    );

    if (!findByIdProduct)
      return res.send({ error: "This product doesn't exist" });

    res.send(findByIdProduct);
  } catch (error) {
    console.log(error);
    res.send({ error: "Internal server error" });
  }
});

app.listen(8080, () => {
  console.log("Server listen in port 8080");
});
