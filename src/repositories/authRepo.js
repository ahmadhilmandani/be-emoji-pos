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
    throw new Error(error)
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
    throw new Error(error)
  }
}


module.exports = { registerStoreRepo, addCashierRepo }