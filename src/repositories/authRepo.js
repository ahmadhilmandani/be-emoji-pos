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
              user_id
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
        await connection.execute(`UPDATE users SET store_id = ? WHERE id = ?`, [resStore.insertId, result.insertId])

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


const addEmployeeRepo = async (connection, name, email, password, storeId) => {
  try {
    const saltRounds = 10

    const sql_statement = `
      INSERT INTO
        users
        (
          name,
          email, 
          password,
          store_id
        )
      VALUES
        (
          ?,
          ?,
          ?,
          ?
        )
    `
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    if (hashedPassword) {
      const [result] = await connection.execute(sql_statement, [name, email, hashedPassword, storeId])
      
      return result

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
      if (result[0].user_role === 'admin') {
        const sql_statement = `
          SELECT
            id
          FROM
            stores
          WHERE
            user_id = ?
          LIMIT 1
        `

        const [resultStore] = await connection.execute(sql_statement, [result[0].id])
        result[0].store_id = resultStore[0].id
        return result
      } else {
        const sql_statement = `
          SELECT
            store_id
          FROM
            cashier_stores
          WHERE
            user_id = ?
          LIMIT 1
        `

        const [resultStore] = await connection.execute(sql_statement, [result[0].id])
        result[0].store_id = resultStore[0].store_id
        return result
      }
    }

    return []

  } catch (error) {
    throw error
  }
}


module.exports = { registerStoreRepo, addEmployeeRepo, loginRepo }