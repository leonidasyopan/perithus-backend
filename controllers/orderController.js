const orderModel = require('../models/orderModel.js');
const { validationResult } = require('express-validator');

function handleListOrders(request, response) {
  orderModel.fecthOrderList((error, data) => {
    if (error || data == null) {
      return response.status(400).json({ success: false, message: error });
    } else {
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
  console.log(`product_id: ${product_id}`);
  const product_amount = request.body.product_amount;
  console.log(`product_amount: ${product_amount}`);
  const username = request.session.username;
  console.log(`username: ${username}`);

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

// function handleUpdateOrder(request, response) {
//   const errors = validationResult(request);
//   if (!errors.isEmpty()) {
//     return response.status(422).json({ errors: errors.array() });
//   }

//   const { id } = request.params;

//   const product_name = request.body.product_name;
//   const product_description = request.body.product_description;
//   const product_price = request.body.product_price;

//   orderModel.updateOrder(
//     id,
//     product_name,
//     product_description,
//     product_price,
//     (error, data) => {
//       if (error) {
//         return response.status(400).json({
//           success: false,
//           error: error,
//         });
//       } else {
//         return response.status(200).json({
//           success: true,
//           message: 'Produto alterado com sucesso!',
//           product: `${product_name}`,
//         });
//       }
//     },
//   );
// }

// function handleDeleteOrder(request, response) {
//   const { id } = request.params;

//   orderModel.deleteOrder(id, (error, data) => {
//     if (error) {
//       return response.status(400).json({
//         success: false,
//         error: error,
//       });
//     } else {
//       return response.status(200).json({
//         success: true,
//         message: 'Produto deletado com sucesso!',
//         product: id,
//       });
//     }
//   });
// }

module.exports = {
  handleListOrders,
  handleAddOrder,
  // handleDeleteOrder,
  // handleUpdateOrder,
};
