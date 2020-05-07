const Router = require('express');
const { check } = require('express-validator');
const userController = require('../controllers/userController');

const userRoutes = Router();

userRoutes.post(
  '/cadastro',
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

userRoutes.post(
  '/login',
  [
    check('email', 'Formato de email inválido. Tente novamente!')
      .isEmail()
      .normalizeEmail(),
    check('password', 'Formato de senha inválido. Tente novamente!').isLength({
      min: 5,
    }),
  ],
  userController.handleLogin,
);

userRoutes.get('/logout', (request, response) => {
  if (request.session.username) {
    request.session.destroy();
    response.clearCookie('delicious-cookie-id');
    return response.status(200).json({
      success: true,
      message: 'Logout bem-sucedido.',
    });
  } else {
    return response.status(400).json({
      success: false,
      error: 'Houve um erro com seu logout.',
    });
  }
});

module.exports = {
  userRoutes,
};
