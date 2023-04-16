const express = require("express");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const { ProductManagerFile } = require("./manager/ProductManager");
const productRouter = require("./routes/products.router");
const cartRouter = require("./routes/carts.router");
const viewsRouter = require("./routes/views.router");

const app = express();
const PORT = 8080;

const httpServer = app.listen(PORT, () => {
  console.log(`Server listen in port: ${PORT}`);
});
const socketServer = new Server(httpServer);

// HANDLEBARS
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
// HANDLEBARS

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static(__dirname + "/public"));

app.use("/", viewsRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

socketServer.on("connection", async (socket) => {
  console.log("Client Connected", socket.id);

  const productManager = new ProductManagerFile();

  socket.on("client:deleteProduct", async (pid, cid) => {
    const id = await productManager.getProductById(parseInt(pid.id));
    if (id) {
      await productManager.deleteProduct(parseInt(pid.id));
      const data = await productManager.getProducts();
      return socketServer.emit("newList", data);
    }
    const dataError = { status: "error", message: "Product Not found" };
    return socketServer.emit("newList", dataError);
  });

  socket.on("client:addProduct", async (data) => {
    const addProduct = await productManager.addProduct(data);
    if (addProduct.status === "error") {
      let errorMessage = addProduct.message;
      socketServer.emit("server:producAdded", { status: "error", errorMessage });
    }
    const newData = await productManager.getProducts();
    return socketServer.emit("server:productAdded", newData);
  });
});
