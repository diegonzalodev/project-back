const express = require("express");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const routerServer = require("./routes");
const { connectDB } = require("./config/configServer.js");
const { ProductManagerFile } = require("./dao/filesystem/ProductManager");
const { messageModel } = require("./dao/mongodb/models/message.model.js");

const app = express();
const PORT = 8080;

connectDB();

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

app.use(routerServer);

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
      socketServer.emit("server:producAdded", {
        status: "error",
        errorMessage,
      });
    }
    const newData = await productManager.getProducts();
    return socketServer.emit("server:productAdded", newData);
  });

  socket.on("chatMessage", async (data) => {
    try {
      const newMessage = new messageModel({
        email: data.email,
        message: data.message,
      });
      const savedMessage = await newMessage.save();
      socketServer.emit("newMessage", savedMessage);
    } catch (error) {
      console.error("There is an error to save the message", error);
    }
  });
});
