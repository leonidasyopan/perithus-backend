const Router = require('express');
const userRoutes = require('./user.routes');
const productRoutes = require('./product.routes');
const orderRoutes = require('./order.routes');

const routes = Router();

routes.get('/', (request, response) => {
  response.json({ message: 'Bem-vindo ao root da API.' });
});

routes.use('/usuario', userRoutes.userRoutes);
routes.use('/produto', productRoutes.productRoutes);
routes.use('/pedidos', orderRoutes.orderRoutes);

module.exports = {
  routes,
};
