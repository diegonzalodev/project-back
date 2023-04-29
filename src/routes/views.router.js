const { Router } = require("express");
const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "../products.json");
const { messageModel } = require("../dao/mongodb/models/message.model.js");

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

router.get("/chat", async (req, res) => {
  try {
    const messages = await messageModel.find().lean();
    res.render("chat", { messages });
  } catch (error) {
    console.error("Error fetching messages from DB:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
