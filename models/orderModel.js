const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });

function fecthOrderList(username, callback) {
  const sql = `SELECT ua.user_id,
  ua.username,
  od.order_id,
  ore.order_payment,
  ore.payment_date,
  ore.order_date,
  ore.order_updated_date,
  od.product_amount,
  p.product_id,
  p.product_name,
  p.product_description,
  p.product_price FROM order_details od
  INNER JOIN order_register ore ON ore.order_id = od.order_id
  INNER JOIN products p ON p.product_id = od.product_id
  INNER JOIN user_access ua ON ua.user_id = ore.user_id
  WHERE ua.username = '${username}'`;

  console.log(sql);

  pool.query(sql, function (error, data) {
    if (error) {
      callback(error, null);
    } else {
      callback(null, data.rows);
    }
  });
}

function createOrder(product_id, product_amount, username, callback) {
  const sqlOne = `INSERT INTO order_register (
    user_id, 
    order_date
  ) VALUES(
    (SELECT user_id FROM user_access WHERE username = '${username}'),     
    current_timestamp
  ) RETURNING order_id`;

  console.log(`sqlOne: ${sqlOne}`);

  pool.query(sqlOne, (error, data1) => {
    if (error) {
      callback(error, null);
    } else {
      const sqlTwo = `INSERT INTO order_details (
        order_id,
        product_id,
        product_amount
      ) VALUES (
        (SELECT order_id 
          FROM order_register 
          ORDER BY order_date DESC 
          LIMIT 1),
        ${product_id},
        ${product_amount}
      )`;

      console.log(`sqlTwo: ${sqlTwo}`);

      pool.query(sqlTwo, (error, data2) => {
        if (error) {
          callback(error, null);
        } else {
          callback(null, data2);
        }
      });
    }
  });
}

function updateOrder(id, product_id, product_amount, username, callback) {
  const sqlOne = `SELECT order_id
    FROM order_register
    WHERE order_id = ${id}
    AND user_id = (SELECT user_id FROM user_access WHERE username = '${username}');`;
  console.log(sqlOne);

  pool.query(sqlOne, (error, result) => {
    if (result.rowCount == 0) {
      console.log(result);
      error = `Você não está autorizado a alterar esse pedido.`;
      callback(error, null);
    } else if (error) {
      console.log(result);
      callback(error, null);
    } else if (result.rows[0].order_id == id) {
      const sqlTwo = `UPDATE order_register
        SET order_updated_date = current_timestamp
        WHERE order_id = ${id};  
        UPDATE order_details
        SET     
          product_id = ${product_id},
          product_amount = ${product_amount}
        WHERE
          order_id = ${id}`;
      console.log(sqlTwo);

      pool.query(sqlTwo, (err, data) => {
        if (err) {
          callback(err, null);
        } else {
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

function deleteOrder(id, username, callback) {
  const sqlOne = `SELECT order_id 
  FROM order_register 
  WHERE order_id = ${id} 
  AND user_id = (SELECT user_id FROM user_access WHERE username = '${username}');`;
  console.log(sqlOne);

  pool.query(sqlOne, (error, result) => {
    if (result.rowCount == 0) {
      console.log(result);
      error = `Você não está autorizado a deletar esse pedido.`;
      callback(error, null);
    } else if (error) {
      callback(error, null);
    } else if (result.rows[0].order_id == id) {
      const sqlTwo = `DELETE FROM order_details WHERE order_id = ${id};
                      DELETE FROM order_register WHERE order_id = ${id}`;

      pool.query(sqlTwo, (err, data) => {
        if (data[0].rowCount === 0 && data[1].rowCount === 0) {
          err = 'Pedido não encontrado no banco de dados.';
          callback(err, null);
        } else if (err) {
          callback(err, null);
        } else {
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
  fecthOrderList,
  createOrder,
  deleteOrder,
  updateOrder,
};
