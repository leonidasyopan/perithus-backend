const express = require("express");
const path = require("path");
require("dotenv").config();
const helmet = require("helmet");

// IMPORTING SESSION STUFF
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const { check, validationResult } = require("express-validator");

const PORT = process.env.PORT || 3333;
var app = express();

// IMPORTING ALL CONTROLLERS
const userController = require("./controllers/userController.js");

app.set("port", PORT);

app.use(express.static(path.join(__dirname, "public")));
// USE SESSION
app.use(
  session({
    name: "delicious-cookie-id",
    secret: "ladfshgoandsuahqwlfoasdhohoasfd",
    saveUninitialized: false,
    resave: false,
    store: new FileStore(),
  })
);

// Body parser middleware to use post values
app.use(express.json()); // support JSON encoded bodies
app.use(express.urlencoded({ extended: true })); // support URL encoded bodies
app.use(function (req, res, next) {
  res.locals.user = req.session.username;
  res.locals.cart = req.session.cart;
  next();
});
app.use(helmet());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Setup our routes

app.get("/logout", (req, res) => {
  if (req.session.username) {
    req.session.destroy();
    res.clearCookie("delicious-cookie-id");
    res.redirect("/login-user");
  } else {
    res.redirect("/login-user");
  }
});

app.get("/", (request, response) => {
  // response.render("pages/getItems");
  response.render("pages/index");
});

app.get("/register-user", (request, response) => {
  response.render("pages/register-user");
});

app.get("/login-user", (request, response) => {
  response.render("pages/login-user");
});

app.post(
  "/register",
  [
    check("email", "Please provide a valid email.").isEmail().normalizeEmail(),
    check("username", "Please define your username.")
      .isLength({ min: 3 })
      .trim()
      .escape(),
    check("password", "Please create your password.").isLength({ min: 5 }),
  ],
  userController.handleRegister
);

app.post(
  "/login",
  [
    check("username", "Please provide your username.")
      .isLength({ min: 3 })
      .trim()
      .escape(),
    check("password", "Please use your password.").isLength({ min: 5 }),
  ],
  userController.handleLogin
);

app.listen(app.get("port"), function () {
  console.log("Now listening for connection on port: ", app.get("port"));
});
