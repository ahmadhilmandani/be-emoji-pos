const connectDb = require('../config/db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const registerRepo = async (email, name, password) => {
  const connection = await connectDb()
  try {
    const saltRounds = 10

    const sql_statement = `
      INSERT INTO
        users
        (
          username,
          name, 
          email, 
          password,
          created_at
        )
      VALUES
        (
          ?,
          ?,
          ?,
          ?,
          ?
        )
    `

    const hashedPassword = await bcrypt.hash(password, saltRounds)

    if (hashedPassword) {
      const [result] = await connection.execute(sql_statement, [username, name, email, hashedPassword, currentDatetime])

      return result
    }
  } catch (error) {
    throw new Error(error)
  }
}

module.exports = { registerRepo }