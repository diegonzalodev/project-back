const { Router } = require("express");
const { auth } = require("../middlewares/authentication.middleware");
const { userModel } = require("../dao/mongodb/models/user.model.js");

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    const existUser = await userModel.findOne({ email });
    if (existUser) return res.send({ status: "error", error: "This email already exists" });
    const newUser = {
      first_name,
      last_name,
      email,
      password,
    };
    let resultUser = await userModel.create(newUser);
    res.redirect("/")
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userDB = await userModel.findOne({ email, password });
  if (!userDB) return res.send({ status: "error", message: "This user doesn't exist or your password is incorrect" });
  req.session.user = {
    first_name: userDB.first_name,
    last_name: userDB.last_name,
    email: userDB.email,
    role: userDB.email === "adminCoder@coder.com" ? "admin" : "user"
  };
  res.redirect("/products");
});

router.get("/private", auth, (req, res) => {
  res.send("This page only can be watched by admins");
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.send({ status: "error", error: err });
    res.redirect("/");
  });
});

module.exports = router;
