const { Router } = require("express");
const cartManager = require("../dao/mongodb/CartManagerMongo");
const productManager = require("../dao/mongodb/ProductManagerMongo");

const router = Router();

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
    const cart = await cartManager
      .getCartById(req.params.cid)
      .populate("products");
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);
    const product = await productManager.getProductById(req.params.pid);
    if (product) {
      const productIndex = cart.products.findIndex(
        (p) => p.id.toString() === req.params.pid
      );
      if (productIndex >= 0) {
        cart.products[productIndex].quantity++;
      } else {
        cart.products.push({ id: product._id, quantity: 1 });
      }
      await cartManager.saveCart(cart);
      res.json({ status: "success", payload: cart });
    } else {
      res
        .status(404)
        .json({ error: `Product with ID ${req.params.pid} not found` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const cart = await cartManager.updateCart(req.params.cid, req.body);
    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:cid/product/:pid", async (req, res) => {
  try {
    const cart = await cartManager.updateProductQuantity(
      req.params.cid,
      req.params.pid,
      req.body.quantity
    );
    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartManager.getCartById(cartId);
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    cart.products = [];
    const updatedCart = await cartManager.saveCart(cart);
    res.json({ status: "success", payload: updatedCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const cart = await cartManager.removeProductFromCart(
      req.params.cid,
      req.params.pid
    );
    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
