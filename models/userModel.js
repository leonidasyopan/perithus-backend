const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });

const bcrypt = require('bcrypt');

function createUser(username, password, email, callback) {
  const sql =
    'INSERT INTO user_access (username, password, email, user_access_created_date, user_access_updated_date) VALUES($1, $2, $3, current_timestamp, current_timestamp) RETURNING  user_id';
  const params = [username, password, email];

  pool.query(sql, params, (error, data) => {
    if (
      error &&
      error.detail === `Key (username)=(${username}) already exists.`
    ) {
      error = 'Esse usuário já existe. Tente novamente!';
      callback(error, null);
    } else if (error) {
      callback(error, null);
    } else {
      callback(null, data.rows);
    }
  });
}

function loginUser(username, password, callback) {
  const sql = `SELECT * from user_access WHERE username = '${username}'`;

  pool.query(sql, (error, data) => {
    if (data.rows.length === 0) {
      err = 'Usuário não encontrado. Por favor tente novamente';
      callback(err, null);
    } else if (error) {
      return response.status(400).json({
        success: false,
        error: 'Houve um erro com os dados. Tente novamente.',
      });
    } else {
      bcrypt.compare(password, data.rows[0].password, (err, matchFound) => {
        if (matchFound) {
          callback(null, data.rows);
        } else {
          err = 'Credenciais incorretas. Tente novamente.';
          callback(err, null);
        }
      });
    }
  });
}

module.exports = {
  createUser,
  loginUser,
};
