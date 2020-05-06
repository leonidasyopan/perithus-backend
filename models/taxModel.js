const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });

function fecthOrdersByMonth(ini_date, end_date, username, callback) {
  const sql = `SELECT od.order_id,
  p.product_id,
  od.product_amount,
  ua.user_id,
  ore.order_payment,
  ore.payment_date,
  ore.order_date,
  p.product_name,
  p.product_description,
  p.product_price,
  username FROM order_details od
  INNER JOIN order_register ore ON ore.order_id = od.order_id
  INNER JOIN products p ON p.product_id = od.product_id
  INNER JOIN user_access ua ON ua.user_id = ore.user_id
  WHERE ore.user_id = (SELECT user_id FROM user_access WHERE username = '${username}')
  AND ore.order_date >= '${ini_date}' 
    AND ore.order_date <= fn_getlastofmonth('${end_date}')`;

  console.log(sql);

  pool.query(sql, function (error, data) {
    if (error) {
      callback(error, null);
    } else {
      callback(null, data.rows);
    }
  });
}

function changeOrderPaymentStatus(id, username, callback) {
  const sqlOne = `SELECT order_id, order_payment
  FROM order_register 
  WHERE order_id = ${id} 
  AND user_id = (SELECT user_id FROM user_access WHERE username = '${username}');`;

  pool.query(sqlOne, (error, result) => {
    if (result.rowCount == 0) {
      error = `Você não está autorizado a alterar informações desse pedido.`;
      callback(error, null);
    } else if (result.rows[0].order_payment == true) {
      error = `Esse pedido já está registrado como pago.`;
      callback(error, null);
    } else if (error) {
      callback(error, null);
    } else if (result.rows[0].order_id == id) {
      const sqlTwo = `UPDATE order_register
      SET     
        order_payment = TRUE,
        payment_date = current_timestamp
      WHERE
        order_id = ${id}
      AND
        user_id = (SELECT user_id FROM user_access WHERE username = '${username}')`;

      pool.query(sqlTwo, (err, data) => {
        if (err) {
          callback(err, null);
        } else {
          console.log(data.rows);
          callback(null, data.rows);
        }
      });
    } else {
      console.log(result);
      error = `Algum erro aconteceu. Tente novamente.`;
      callback(error, null);
    }
  });
}

module.exports = {
  fecthOrdersByMonth,
  changeOrderPaymentStatus,
};
