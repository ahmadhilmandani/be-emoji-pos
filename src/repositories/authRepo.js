const connectDb = require('../config/db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const registerStoreRepo = async (email, name, password, store_name, store_address, store_phone) => {
  const connection = await connectDb()
  try {
    const saltRounds = 10

    const sql_statement = `
      INSERT INTO
        users
        (
          name,
          email, 
          password, 
          user_role
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
      const [result] = await connection.execute(sql_statement, [name, email, hashedPassword, 'admin'])

      if (result.affectedRows) {
        const sql_statement_store = `
          INSERT INTO
            stores
            (
              name,
              address, 
              phone, 
              owner_id
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
        const [resStore] = await connection.execute(sql_statement_store, [store_name, store_address, store_phone])

        return {
          'user_id': result.insertId,
          'store_id': resStore.insertId
        }
      }

    }
  } catch (error) {
    throw new Error(error)
  }
}


const addCashierRepo = async (name, email, password, storeId) => {
  const connection = await connectDb()

  try {
    const saltRounds = 10

    const sql_statement = `
      INSERT INTO
        users
        (
          name,
          email, 
          password
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
      const [result] = await connection.execute(sql_statement, [name, email, hashedPassword])

      if (result.affectedRows) {
        const sql_statement_cashier_store = `
          INSERT INTO
            cashier_stores
            (
              user_id,
              store_id
            )
          VALUES
            (
              ?,
              ?
            )
        `
        const [resultCashier] = await connection.execute(sql_statement_cashier_store, [result.insertId, storeId])

        if (resultCashier.affectedRows) {
          return result.insertId
        }
      }
    }
  } catch (error) {
    throw new Error(error)
  }
}


module.exports = { registerStoreRepo, addCashierRepo }