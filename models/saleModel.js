const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });

function fecthSaleList(username, callback) {
  const sql = `SELECT ua.user_id,
  ua.username,
  sd.sale_id,
  sr.sale_date,
  sd.sale_price_per_product,
  sd.product_amount,
  p.product_id,
  p.product_name,
  p.product_description,
  p.product_price FROM sale_details sd
  INNER JOIN sale_register sr ON sr.sale_id = sd.sale_id
  INNER JOIN products p ON p.product_id = sd.product_id
  INNER JOIN user_access ua ON ua.user_id = sr.user_id
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

function createSale(
  product_id,
  product_amount,
  sale_price_per_product,
  username,
  callback,
) {
  const sqlOne = `INSERT INTO sale_register (
    user_id, 
    sale_date
  ) VALUES(
    (SELECT user_id FROM user_access WHERE username = '${username}'),     
    current_timestamp
  ) RETURNING sale_id`;

  console.log(`sqlOne: ${sqlOne}`);

  pool.query(sqlOne, (error, data1) => {
    if (error) {
      callback(error, null);
    } else {
      const sqlTwo = `INSERT INTO sale_details (
        sale_id,
        product_id,
        product_amount,
        sale_price_per_product
      ) VALUES (
        (SELECT sale_id 
          FROM sale_register 
          ORDER BY sale_date DESC 
          LIMIT 1),
        ${product_id},
        ${product_amount},
        ${sale_price_per_product}
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

function updateSale(
  id,
  product_id,
  product_amount,
  sale_price_per_product,
  username,
  callback,
) {
  const sqlOne = `SELECT sale_id
  FROM sale_register
  WHERE sale_id = ${id}
  AND user_id = (SELECT user_id FROM user_access WHERE username = '${username}');`;
  console.log(sqlOne);

  pool.query(sqlOne, (error, result) => {
    if (result.rowCount == 0) {
      console.log(result);
      error = `Você não está autorizado a alterar esse registro venda.`;
      callback(error, null);
    } else if (error) {
      console.log(result);
      callback(error, null);
    } else if (result.rows[0].sale_id == id) {
      const sqlTwo = `UPDATE sale_register
      SET sale_updated_date = current_timestamp
      WHERE sale_id = ${id};  
      UPDATE sale_details
      SET     
        product_id = ${product_id},
        product_amount = ${product_amount},
        sale_price_per_product = ${sale_price_per_product}
      WHERE
        sale_id = ${id}`;
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

function deleteSale(id, username, callback) {
  const sqlOne = `SELECT sale_id
  FROM sale_register
  WHERE sale_id = ${id}
  AND user_id = (SELECT user_id FROM user_access WHERE username = '${username}');`;
  console.log(sqlOne);

  pool.query(sqlOne, (error, result) => {
    if (result.rowCount == 0) {
      console.log(result);
      error = `Você não está autorizado a deletar esse registro venda.`;
      callback(error, null);
    } else if (error) {
      callback(error, null);
    } else if (result.rows[0].sale_id == id) {
      const sqlTwo = `DELETE FROM sale_details WHERE sale_id = ${id};
                      DELETE FROM sale_register WHERE sale_id = ${id}`;

      pool.query(sqlTwo, (err, data) => {
        if (data[0].rowCount === 0 && data[1].rowCount === 0) {
          err = 'Registro de venda não encontrado no banco de dados.';
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
  fecthSaleList,
  createSale,
  deleteSale,
  updateSale,
};
