const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });

function fecthOrderList(callback) {
  const sql = `SELECT * FROM order_details od
  INNER JOIN order_register ore ON ore.order_id = od.order_id
  INNER JOIN products p ON p.product_id = od.product_id
  INNER JOIN user_access ua ON ua.user_id = ore.user_id`;

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

// function updateOrder(
//   id,
//   product_name,
//   product_description,
//   product_price,
//   callback,
// ) {
//   const sql = `UPDATE products
//   SET
//     product_name = $1,
//     product_description = $2,
//     product_price = $3
//   WHERE
//     product_id = $4;`;
//   const params = [product_name, product_description, product_price, id];

//   pool.query(sql, params, (error, data) => {
//     if (data.rowCount === 0) {
//       error = 'Produto não encontrado no banco de dados. Tente novamente!';
//       callback(error, null);
//     } else if (error) {
//       callback(error, null);
//     } else {
//       callback(null, data.rows);
//     }
//   });
// }

// function deleteOrder(id, callback) {
//   const sql = `DELETE FROM products WHERE product_id = ${id}`;

//   pool.query(sql, (error, data) => {
//     if (data.rowCount === 0) {
//       error = 'Produto não encontrado no banco de dados.';
//       callback(error, null);
//     } else if (error) {
//       callback(error, null);
//     } else {
//       callback(null, data.rows);
//     }
//   });
// }

module.exports = {
  fecthOrderList,
  createOrder,
  // deleteOrder,
  // updateOrder,
};
