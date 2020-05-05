const productModel = require('../models/productModel.js');
const { validationResult } = require('express-validator');

function handleListProducts(request, response) {
  productModel.fecthProductList((error, data) => {
    if (error || data == null) {
      return response.status(400).json({ success: false, message: error });
    } else {
      return response.status(200).json(data);
    }
  });
}

function handleAddProduct(request, response) {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(422).json({ errors: errors.array() });
  }

  const product_name = request.body.product_name;
  console.log(product_name);
  const product_description = request.body.product_description;
  console.log(product_description);
  const product_price = request.body.product_price;
  console.log(product_price);

  productModel.createProduct(
    product_name,
    product_description,
    product_price,
    (error, data) => {
      if (error) {
        return response.status(400).json({
          success: false,
          error: error,
        });
      } else {
        return response.status(200).json({
          success: true,
          message: 'Produto criado com sucesso!',
          username: `${product_name}`,
        });
      }
    },
  );
}

module.exports = {
  handleListProducts,
  handleAddProduct,
};
