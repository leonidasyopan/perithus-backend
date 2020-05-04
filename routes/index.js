const Router = require('express');
const userRoutes = require('./user.routes');

const routes = Router();

routes.get('/', (request, response) => {
  response.json({ message: 'Bem-vindo ao root da API.' });
});
routes.use('/user', userRoutes.userRoutes);

module.exports = {
  routes,
};
