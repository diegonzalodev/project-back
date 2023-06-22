const { Router } = require("express");
const passport = require("passport");
const { userModel } = require("../dao/mongodb/models/user.model");
const { auth } = require("../middlewares/authentication.middleware");
const { isValidPassword, createHash } = require("../utils/bcryptHash");
const { generateToken } = require("../utils/jwt");

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    const existUser = await userModel.findOne({ email });
    if (existUser)
      return res.send({ status: "error", error: "This email already exists" });
    const newUser = {
      first_name,
      last_name,
      email,
      password: createHash(password),
    };
    let resultUser = await userModel.create(newUser);
    let token = generateToken(newUser);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userDB = await userModel.findOne({ email });
    if (!userDB) return res.send({ status: "error", message: "This user doesn't exist" });
    if (!isValidPassword(password, userDB))
      return res.status(401).send({ status: "error", message: "Your password is incorrect" });
    const access_token = generateToken({
      first_name: userDB.first_name,
      last_name: userDB.last_name,
      email: userDB.email,
      role: userDB.email === "adminCoder@coder.com" ? "admin" : "user",
    });
    res.cookie("coderCookieToken", access_token, { maxAge: 60*60*100, httpOnly: true })
    res.redirect("/products");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  () => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/" }),
  async (req, res) => {
    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      role: req.user.email === "adminCoder@coder.com" ? "admin" : "user",
    };
    res.redirect("/products");
  }
); */

router.get("/private", auth, (req, res) => {
  res.send("This page only can be watched by admins");
});

router.post("/logout", (req, res) => {
  res.clearCookie("coderCookieToken");
  res.redirect("/");
});

module.exports = router;
