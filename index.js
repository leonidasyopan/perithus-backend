const express = require('express');
const path = require('path');
require('dotenv').config();
const helmet = require('helmet');

// IMPORTING SESSION STUFF
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const { check } = require('express-validator');

const PORT = process.env.PORT || 3333;
const app = express();

// IMPORTING ALL CONTROLLERS
const userController = require('./controllers/userController.js');

app.set('port', PORT);

app.use(
  session({
    name: 'delicious-cookie-id',
    secret: 'ladfshgoandsuahqwlfoasdhohoasfd',
    saveUninitialized: false,
    resave: false,
    store: new FileStore(),
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((request, response, next) => {
  response.locals.user = request.session.username;
  response.locals.cart = request.session.cart;
  next();
});
app.use(helmet());

app.get('/', (request, response) => {
  response.json({ message: 'Welcome to the API root directory' });
});

app.post(
  '/register',
  [
    check('email', 'E-mail inválido. Tente novamente.')
      .isEmail()
      .normalizeEmail(),
    check('username', 'Defina um usuário, mínimo 5 caracteres.')
      .isLength({ min: 5 })
      .trim()
      .escape(),
    check('password', 'Crie sua senha.').isLength({ min: 5 }),
  ],
  userController.handleRegister,
);

app.post(
  '/login',
  [
    check('username', 'Please provide your username.')
      .isLength({ min: 3 })
      .trim()
      .escape(),
    check('password', 'Please use your password.').isLength({ min: 5 }),
  ],
  userController.handleLogin,
);

app.get('/logout', (request, response) => {
  if (request.session.username) {
    request.session.destroy();
    response.clearCookie('delicious-cookie-id');
    return response.status(200).json({
      message: 'Logout Successfully',
    });
  } else {
    return response.status(400).json({
      error: 'There was an erro with your logout',
    });
  }
});

app.listen(app.get('port'), () => {
  console.log('Now listening for connection on port: ', app.get('port'));
});
