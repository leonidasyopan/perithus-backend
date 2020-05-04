const productModel = require('../models/userModel.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { validationResult } = require('express-validator');

function handleRegister(request, response) {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(422).json({ errors: errors.array() });
  }

  const email = request.body.email;
  const username = request.body.username;
  const password = request.body.password;

  bcrypt.hash(password, saltRounds, function (err, hash) {
    try {
      productModel.createUser(username, hash, email, function (error, data) {
        if (error) {
          return response.status(400).json({
            success: false,
            error: error,
          });
        } else {
          return response.status(200).json({
            success: true,
            message: 'Usuário criado com sucesso!',
            username: `${username}`,
          });
        }
      });
    } catch (err) {
      return response.status(400).json({
        error: 'Problema com o hash da senha. Tente novamente.',
      });
    }
  });
}

function handleLogin(request, response) {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(422).json({ errors: errors.array() });
  }

  const username = request.body.username;
  const password = request.body.password;

  productModel.loginUser(username, password, function (error, data) {
    if (error) {
      return response.status(400).json({
        success: false,
        message: error,
      });
    } else {
      request.session.username = username;
      request.session.cart = [];
      return response.status(200).json({
        success: true,
        message: 'Login efetuado.',
        username: `${username}`,
      });
    }
  });
}

module.exports = {
  handleRegister: handleRegister,
  handleLogin: handleLogin,
};
