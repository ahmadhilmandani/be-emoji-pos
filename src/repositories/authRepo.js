const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const registerStoreRepo = async (connection, email, name, password, age, sex, phone, store_name, store_address, store_phone) => {

  try {
    const saltRounds = 10

    const sql_statement = `
      INSERT INTO
        users
        (
          name,
          email, 
          password, 
          user_role,
          age,
          sex,
          phone
        )
      VALUES
        (
          ?,
          ?, 
          ?, 
          ?,
          ?,
          ?,
          ?
        )
    `

    const hashedPassword = await bcrypt.hash(password, saltRounds)

    if (hashedPassword) {
      const [result] = await connection.execute(sql_statement, [name, email, hashedPassword, 'admin', age, sex, phone])

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
              ?
            )
        `
        const [resStore] = await connection.execute(sql_statement_store, [store_name, store_address, store_phone, result.insertId])

        return {
          'user_id': result.insertId,
          'store_id': resStore.insertId
        }
      }

    }
  } catch (error) {
    throw error
  }
}


const addCashierRepo = async (connection, name, email, password, storeId) => {
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
    throw error
  }
}


const loginRepo = async (connection, email, password) => {
  try {
    const sql_statement = `
      SELECT
        *
      FROM
        users
      WHERE
        email = ?
      LIMIT 1
    `

    const [result] = await connection.execute(sql_statement, [email])

    if (result.length == 0) {
      return []
    }

    const match = await bcrypt.compare(password, result[0].password)
    if (match) {
      return result
    }

    return []

  } catch (error) {
    throw error
  }
}


module.exports = { registerStoreRepo, addCashierRepo, loginRepo }