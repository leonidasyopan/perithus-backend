const userModel = require('../models/userModel.js');
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
      userModel.createUser(username, hash, email, (error, data) => {
        if (error) {
          return response.status(400).json({
            success: false,
            message: error,
          });
        } else {
          return response.status(200).json({
            success: true,
            message: 'Usuário criado com sucesso!',
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

  const email = request.body.email;
  const password = request.body.password;

  userModel.loginUser(email, password, (error, data) => {
    if (error) {
      return response.status(400).json({
        success: false,
        message: error,
      });
    } else {
      const username = data[0].username;
      console.log(`data: ${data[0].username}`);

      if (request.session.username == username) {
        console.log(`1st: ${request.session.username}`);

        return response.status(400).json({
          success: false,
          message: 'Você já está logado.',
        });
      }

      request.session.username = username;
      console.log(`2nd: ${request.session.username}`);
      request.session.cart = [];
      return response.status(200).json({
        success: true,
        message: 'Login efetuado com sucesso.',
      });
    }
  });
}

module.exports = {
  handleRegister: handleRegister,
  handleLogin: handleLogin,
};
