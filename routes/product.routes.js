const Router = require('express');
const { check } = require('express-validator');
const productController = require('../controllers/productController');

const productRoutes = Router();

productRoutes.get('/listar-produtos', productController.handleListProducts);
productRoutes.post(
  '/adicionar-produtos',
  [
    check('product_name', 'Forneça apenas o nome do produto.').trim().escape(),
    check('product_description', 'Fornaça a descrição do produto.')
      .trim()
      .escape(),
    check('product_price', 'Forneça apenas o preço (numérico).')
      .trim()
      .escape()
      .toFloat(),
  ],
  productController.handleAddProduct,
);

module.exports = {
  productRoutes,
};
