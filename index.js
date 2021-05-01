require("dotenv").config();
const express = require("express");
const passport = require("passport");
require("./config/db");
const cookieSession = require("cookie-session");
require("./config/passport-setup");

const app = express();

app.use(require("cors")());

// view engine setup
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  cookieSession({
    name: "node-auth-project-session",
    keys: ["key1", "key2"],
  })
);

const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  }

  res.redirect("/");
};

// Initializes passport and passport sessions
app.use(passport.initialize());
app.use(passport.session());

app.use(require("cookie-parser")());

app.get("/facebook", passport.authenticate("facebook", { scope: "email" }));

app.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/" }),
  function (req, res) {
    res.redirect("/profile");
  }
);

app.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  function (req, res) {
    res.redirect("/profile");
  }
);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/profile", isLoggedIn, (req, res) => {
  res.render("profile", { user: req.user });
});

app.get("/logout", (req, res) => {
  req.session = null;
  req.logout();
  res.redirect("/");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server is running on port ${PORT}`));
