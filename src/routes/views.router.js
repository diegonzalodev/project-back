const { Router } = require("express");
const { productModel } = require("../dao/mongodb/models/product.model.js");
const { messageModel } = require("../dao/mongodb/models/message.model.js");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const data = await productModel.find().lean();
    res.render("home", { products: data });
  } catch (error) {
    console.error(error);
    res.render("home", { products: [] });
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    const data = await productModel.find().lean();
    res.render("realTimeProducts", { products: data });
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
