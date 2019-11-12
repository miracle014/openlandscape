import mysql from 'mysql';
import util from 'util';

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'mysql',
  port: '3306',
  user: 'root',
  password: 'plokij123654',
  database: 'OPENLANDSCAPE'
})

pool.getConnection((err, connection) => {
  if (err) {
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
          console.error('Database connection was closed.')
      }
      if (err.code === 'ER_CON_COUNT_ERROR') {
          console.error('Database has too many connections.')
      }
      if (err.code === 'ECONNREFUSED') {
          console.error('Database connection was refused.')
      }
  }
  if (connection) connection.release()
  return
})

pool.query = util.promisify(pool.query)

module.exports = pool