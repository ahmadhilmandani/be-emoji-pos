const mysql = require('mysql2/promise')

let pool 

async function connectDb() {
  if (!pool) {    
    pool =  await mysql.createPool(
      {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DB,
        namedPlaceholders: true,
      }
    )
  }
  return pool
}

module.exports = connectDb