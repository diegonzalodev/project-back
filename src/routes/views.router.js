const { Router } = require("express");
const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "../products.json");

const router = Router();

router.get("/", (req, res) => {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    const products = JSON.parse(data);
    res.render("home", { products: products });
  } catch (error) {
    console.error(error);
    res.render("home", { products: [] });
  }
});

router.get("/realtimeproducts", (req, res) => {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    const products = JSON.parse(data);
    res.render("realTimeProducts", { products: products });
  } catch (error) {
    console.error(error);
    res.render("realTimeProducts", { products: [] });
  }
});

router.get("/chat", (req, res) => {
  res.render("chat", {});
});

module.exports = router;
