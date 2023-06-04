const { Router } = require("express");
const passport = require("passport");
const { auth } = require("../middlewares/authentication.middleware");

const router = Router();

<<<<<<< HEAD
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
=======
router.post("/register", passport.authenticate("register", { failureRedirect: "/api/session/failregister" }), async (req, res) => {
  res.redirect("/")
>>>>>>> develop
});

router.post("/login", passport.authenticate("login", {failureRedirect: "/api/session/faillogin"}), async (req, res) => {
  if (!req.user) return res.status(401).send({status: "error", message: "Invalid credentials"})
  req.session.user = {
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    email: req.user.email,
    role: req.user.email === "adminCoder@coder.com" ? "admin" : "user"
  }
  res.redirect("/products")
});

router.get("/failregister", async (req, res) => {
  res.send({ status: "error", error: "An error occurred" });
});

router.get("/faillogin", async (req, res) => {
  res.send({ status: "error", error: "An error occurred" });
});

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), () => {}
);

router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/" }), async (req, res) => {
    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      role: req.user.email === "adminCoder@coder.com" ? "admin" : "user"
    };
    res.redirect("/products");
  }
);

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
