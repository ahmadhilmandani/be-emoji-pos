const mysql = require('mysql2/promise')

let pool 

async function connectDb() {
  if (!pool) {    
    pool = await mysql.createPool(
      {
        host: process.env.MARIADB_HOST,
        port: process.env.MARIADB_PORT,
        user: process.env.MARIADB_USER,
        password: process.env.MARIADB_PASS,
        database: process.env.MARIADB_NAME,
        namedPlaceholders: true,
      }
    )
  }
  return pool
}

module.exports = connectDb