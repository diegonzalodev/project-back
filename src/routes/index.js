const { Router } = require("express");
const viewsRouter = require("./views.router");
const productsRouter = require("./products.router");
const cartsRouter = require("./carts.router");

const router = Router();

router.use("/", viewsRouter);
router.use("/api/products", productsRouter);
router.use("/api/carts", cartsRouter);

module.exports = router;
