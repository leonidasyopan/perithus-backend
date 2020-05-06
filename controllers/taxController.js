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
      const result = [];
      const taxTotal = data.map((item) => {
        const compute =
          Number(item.product_price) * Number(item.product_amount) * 0.06;
        item.tax_owned = compute;
        return compute;
      });

      result.push(data);
      result.push(taxTotal);
      return response.status(200).json(result);
    }
  });
}

module.exports = {
  handleOrdersTaxByPeriod,
};
