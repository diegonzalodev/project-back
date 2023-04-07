const { Router } = require("express");
const { CartManagerFile } = require("../manager/CartManager");
const { ProductManagerFile } = require("../manager/ProductManager");

const router = Router();
const cartManager = new CartManagerFile();
const productManager = new ProductManagerFile();

router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.send({ status: "success", payload: newCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const getProducts = await cartManager.getProductsOfCart(Number(req.params.cid));
    if (!getProducts) return res.send({ error: "There is no cart with this ID" });
    res.send({ status: "success", payload: getProducts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cart = await cartManager.getCardById(Number(req.params.cid));
    const product = await productManager.getProductById(Number(req.params.pid));
    if (product) {
      const productIndex = cart.products.findIndex((p) => p.id === Number(req.params.pid));
      if (productIndex >= 0) {
        cart.products[productIndex].quantity++;
      } else {
        cart.products.push({ id: Number(req.params.pid), quantity: 1 });
      }
      await cartManager.saveCart(cart);
      res.send({ status: "success", payload: cart });
    } else {
      res.status(404).json({ error: `Product with ID ${req.params.pid} not found` });
    }
    await cartManager.saveCart(cart);
    res.send({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
