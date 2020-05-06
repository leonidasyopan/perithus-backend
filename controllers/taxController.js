const taxModel = require('../models/taxModel.js');
const { validationResult } = require('express-validator');

function handleOrdersTaxByPeriod(request, response) {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(422).json({ errors: errors.array() });
  }

  const ini_date = request.body.ini_date;
  const end_date = request.body.end_date;

  const username = request.session.username;

  taxModel.fecthOrdersByMonth(ini_date, end_date, username, (error, data) => {
    if (error || data == null) {
      return response.status(400).json({ success: false, message: error });
    } else {
      // This method iterates through each item to compute the owned tax
      // then adds this information as a key value pair.
      data.map((item) => {
        const compute =
          Number(item.product_price) * Number(item.product_amount) * 0.06;
        item.tax_owned = compute;
      });

      // This method iterates through each order and add all the tax_owned
      const totalTax = data.reduce((total, item) => {
        return total + item.tax_owned;
      }, 0);

      // Creates a new object to store the WHOLE information. Including DB
      // data and the total owned tax - which was just added together.
      const completeData = {
        orderListDetailed: data,
        totalTaxOwned: totalTax,
      };

      return response.status(200).json(completeData);
    }
  });
}

function handleOrderPaymentStatus(request, response) {
  const { id } = request.params;

  taxModel.changeOrderPaymentStatus(id, (error, data) => {
    if (error) {
      return response.status(400).json({
        success: false,
        error: error,
      });
    } else {
      return response.status(200).json({
        success: true,
        message: 'Pagamento registrado com sucesso.',
        product: id,
      });
    }
  });
}

module.exports = {
  handleOrdersTaxByPeriod,
  handleOrderPaymentStatus,
};
