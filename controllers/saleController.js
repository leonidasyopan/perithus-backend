const saleModel = require('../models/saleModel.js');
const { validationResult } = require('express-validator');

function handleListSales(request, response) {
  const username = request.session.username;

  saleModel.fecthSaleList(username, (error, data) => {
    if (error || data == null) {
      return response.status(400).json({ success: false, message: error });
    } else {
      // Map method to calculate the total of the sale
      data.map((item) => {
        const totalItems =
          Number(item.sale_price_per_product) * Number(item.product_amount);
        item.sale_total = totalItems;
      });

      return response.status(200).json(data);
    }
  });
}

function handleAddSale(request, response) {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(422).json({ errors: errors.array() });
  }

  const product_id = request.body.product_id;
  const product_amount = request.body.product_amount;
  const sale_price_per_product = request.body.sale_price_per_product;
  const username = request.session.username;

  saleModel.createSale(
    product_id,
    product_amount,
    sale_price_per_product,
    username,
    (error, data) => {
      if (error) {
        return response.status(400).json({
          success: false,
          error: error,
        });
      } else {
        return response.status(200).json({
          success: true,
          message: 'Venda registrada com sucesso!',
          product: `${product_id}`,
        });
      }
    },
  );
}

function handleUpdateSale(request, response) {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(422).json({ errors: errors.array() });
  }

  const { id } = request.params;

  const product_id = request.body.product_id;
  const product_amount = request.body.product_amount;
  const sale_price_per_product = request.body.sale_price_per_product;
  const username = request.session.username;

  saleModel.updateSale(
    id,
    product_id,
    product_amount,
    sale_price_per_product,
    username,
    (error, data) => {
      if (error) {
        return response.status(400).json({
          success: false,
          error: error,
        });
      } else {
        return response.status(200).json({
          success: true,
          message: 'Registro de venda alterado com sucesso!',
          product: `${product_id}`,
        });
      }
    },
  );
}

function handleDeleteSale(request, response) {
  const { id } = request.params;

  const username = request.session.username;

  saleModel.deleteSale(id, username, (error, data) => {
    if (error) {
      return response.status(400).json({
        success: false,
        error: error,
      });
    } else {
      return response.status(200).json({
        success: true,
        message: 'Registro de venda deletado com sucesso!',
        product: id,
      });
    }
  });
}

module.exports = {
  handleListSales,
  handleAddSale,
  handleDeleteSale,
  handleUpdateSale,
};
