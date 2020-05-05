const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });

function fecthProductList(callback) {
  const sql = `SELECT * FROM products`;

  pool.query(sql, function (error, data) {
    if (error) {
      callback(error, null);
    } else {
      callback(null, data.rows);
    }
  });
}

function createProduct(
  product_name,
  product_description,
  product_price,
  callback,
) {
  const sql = `INSERT INTO products (
      product_name,
      product_description,
      product_price
      ) VALUES($1, $2, $3) RETURNING  product_id`;
  const params = [product_name, product_description, product_price];

  pool.query(sql, params, (error, data) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, data.rows);
    }
  });
}

function updateProduct(
  id,
  product_name,
  product_description,
  product_price,
  callback,
) {
  const sql = `UPDATE products
  SET     
    product_name = $1,
    product_description = $2,
    product_price = $3
  WHERE
    product_id = $4;`;
  const params = [product_name, product_description, product_price, id];

  pool.query(sql, params, (error, data) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, data.rows);
    }
  });
}

function deleteProduct(id, callback) {
  const sql = `DELETE FROM products WHERE product_id = ${id}`;

  pool.query(sql, (error, data) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, data.rows);
    }
  });
}

module.exports = {
  fecthProductList,
  createProduct,
  deleteProduct,
  updateProduct,
};
