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
    AND ore.order_date < fn_getlastofmonth('${end_date}')`;

  console.log(sql);

  pool.query(sql, function (error, data) {
    if (error) {
      callback(error, null);
    } else {
      callback(null, data.rows);
    }
  });
}

function changeOrderPaymentStatus(id, callback) {
  const sql = `DELETE FROM products WHERE product_id = ${id}`;

  pool.query(sql, (error, data) => {
    if (data.rowCount === 0) {
      error = 'Produto não encontrado no banco de dados.';
      callback(error, null);
    } else if (error) {
      callback(error, null);
    } else {
      callback(null, data.rows);
    }
  });
}

module.exports = {
  fecthOrdersByMonth,
  changeOrderPaymentStatus,
};
