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
      .toFloat(),
    check('product_amount', 'Forneça uma quantidade válida.')
      .trim()
      .escape()
      .toFloat(),
  ],
  orderController.handleAddOrder,
);

// orderRoutes.put(
//   '/alterar-pedido/:id',
//   [
//     check('product_name', 'Forneça apenas o nome do produto.').trim().escape(),
//     check('product_description', 'Fornaça a descrição do produto.')
//       .trim()
//       .escape(),
//     check('product_price', 'Forneça apenas o preço (numérico).')
//       .trim()
//       .escape()
//       .toFloat(),
//   ],
//   orderController.handleUpdateOrder,
// );

// orderRoutes.delete('/excluir-pedido/:id', orderController.handleDeleteOrder);

module.exports = {
  orderRoutes,
};
