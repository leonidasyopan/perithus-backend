const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });

function fecthOrderList(callback) {
  const sql = `SELECT * FROM products`;

  pool.query(sql, function (error, data) {
    if (error) {
      callback(error, null);
    } else {
      callback(null, data.rows);
    }
  });
}

function createOrder(product_id, product_amount, callback) {
  const sql = `INSERT INTO order_register (
    user_id, 
    order_date
  ) VALUES(
    $1,     
    current_timestamp
  ) RETURNING order_id`;
  const params = [product_name, product_description, product_price];

  pool.query(sql, params, (error, data) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, data.rows);
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
