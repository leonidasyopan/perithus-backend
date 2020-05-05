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

function createProduct() {}

module.exports = {
  fecthProductList,
};
