const { Router } = require("express");
const productManager = require("../dao/mongodb/ProductManagerMongo");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    let { limit } = req.query;
    limit = parseInt(limit);
    if (!limit || limit <= 0 || limit > products.length)
      return res.send({ status: "success", payload: products });
    res.send(products.slice(0, limit));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const addedProduct = await productManager.addProduct(req.body);
    res.send(addedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    const findByID = products.find((prod) => prod.id === req.params.pid);
    if (!findByID) return res.send({ error: "This product doesn't exist" });
    res.send(findByID);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const updatedProduct = await productManager.updateProduct(
      req.params.pid,
      req.body
    );
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const deletedProduct = await productManager.deleteProduct(req.params.pid);
    res.send(deletedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
