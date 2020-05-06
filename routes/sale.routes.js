const Router = require('express');
const { check } = require('express-validator');
const saleController = require('../controllers/saleController');

const saleRoutes = Router();

saleRoutes.get('/listar-vendas', saleController.handleListSales);

saleRoutes.post(
  '/nova-venda',
  [
    check('product_id', 'A id do produto é um número natural')
      .trim()
      .escape()
      .toInt(),
    check('product_amount', 'Forneça uma quantidade válida.')
      .trim()
      .escape()
      .toInt(),
    check('sale_price_per_product', 'Forneça um preço de venda válido.')
      .trim()
      .escape()
      .toInt(),
  ],
  saleController.handleAddSale,
);

// saleRoutes.put(
//   '/alterar-venda/:id',
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
//   saleController.handleUpdateSale,
// );

// saleRoutes.delete('/excluir-venda/:id', saleController.handleDeleteSale);

module.exports = {
  saleRoutes,
};
