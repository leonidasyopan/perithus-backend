const productModel = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { check, validationResult } = require("express-validator");

function handleRegister(request, response) {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    console.log(errors);
    return response.status(422).json({ errors: errors.array() });
  }

  const email = request.body.email;
  const username = request.body.username;
  const password = request.body.password;

  bcrypt.hash(password, saltRounds, function (err, hash) {
    productModel.createUser(username, hash, email, function (error, data) {
      if (error) {
        console.log(error);
      } else {
        // response.json(data);
        console.log(
          `An account has been successfully created for the username: ${username}`
        );
        response.redirect("/login-user");
      }
    });
  });
}

function handleLogin(request, response) {
  console.log(`Entered handleLogin function in Controller`);

  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    console.log(
      `Errors with INPUT inside handleLogin function in Controller: ${errors}`
    );
    return response.status(422).json({ errors: errors.array() });
  }

  const username = request.body.username;
  const password = request.body.password;
  console.log(
    `In Controller. Got the username and password: ${username}, ${password}`
  );

  productModel.loginUser(username, password, function (error, data) {
    if (error) {
      console.log(
        `Back to handleLogin function inController with error: ${error}`
      );
      response.json({
        success: false,
        message: "Password didn't match. Try again, please!",
      });
      response.end();
    } else {
      console.log(`Back to handleLogin function inController with NO error.`);
      request.session.username = username;
      request.session.cart = [];
      console.log(
        `After successul login. Created Session: ${request.session.username} and cart: ${request.session.cart}`
      );
      response.redirect("/");
    }
  });
}

module.exports = {
  handleRegister: handleRegister,
  handleLogin: handleLogin,
};
