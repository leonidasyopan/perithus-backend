const orderModel = require('../models/orderModel.js');
const { validationResult } = require('express-validator');

function handleListOrders(request, response) {
  const username = request.session.username;

  orderModel.fecthOrderList(username, (error, data) => {
    if (error || data == null) {
      return response.status(400).json({ success: false, message: error });
    } else {
      // Map method to calculate the total of the order
      data.map((item) => {
        const totalItems =
          Number(item.product_price) * Number(item.product_amount);
        item.order_total = totalItems;
      });

      return response.status(200).json(data);
    }
  });
}

function handleAddOrder(request, response) {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(422).json({ errors: errors.array() });
  }

  const product_id = request.body.product_id;
  const product_amount = request.body.product_amount;
  const username = request.session.username;

  orderModel.createOrder(
    product_id,
    product_amount,
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
          message: 'Pedido enviado com sucesso!',
          product: `${product_id}`,
        });
      }
    },
  );
}

function handleUpdateOrder(request, response) {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(422).json({ errors: errors.array() });
  }

  const { id } = request.params;

  const product_id = request.body.product_id;
  const product_amount = request.body.product_amount;
  const username = request.session.username;

  orderModel.updateOrder(
    id,
    product_id,
    product_amount,
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
          message: 'Pedido alterado com sucesso!',
          product: `${product_id}`,
        });
      }
    },
  );
}

function handleDeleteOrder(request, response) {
  const { id } = request.params;

  const username = request.session.username;

  orderModel.deleteOrder(id, username, (error, data) => {
    if (error) {
      return response.status(400).json({
        success: false,
        error: error,
      });
    } else {
      return response.status(200).json({
        success: true,
        message: 'Pedido deletado com sucesso!',
        product: id,
      });
    }
  });
}

module.exports = {
  handleListOrders,
  handleAddOrder,
  handleDeleteOrder,
  handleUpdateOrder,
};
