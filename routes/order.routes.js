const Router = require('express');
const { check } = require('express-validator');
const orderController = require('../controllers/orderController');

const orderRoutes = Router();

orderRoutes.get('/listar-pedidos', orderController.handleListOrders);

orderRoutes.post(
  '/novo-pedido',
  [
    check('product_id', 'A id do produto é um número natural')
      .trim()
      .escape()
      .toInt(),
    check('product_amount', 'Forneça uma quantidade válida.')
      .trim()
      .escape()
      .toInt(),
  ],
  orderController.handleAddOrder,
);

orderRoutes.put(
  '/alterar-pedido/:id',
  [
    check('product_id', 'A id do produto é um número natural')
      .trim()
      .escape()
      .toInt(),
    check('product_amount', 'Forneça uma quantidade válida.')
      .trim()
      .escape()
      .toInt(),
  ],
  orderController.handleUpdateOrder,
);

orderRoutes.delete('/excluir-pedido/:id', orderController.handleDeleteOrder);

module.exports = {
  orderRoutes,
};
