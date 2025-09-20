const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const addOwnerRepo = async (connection, email, name, password, age, sex, phone, store_name, store_address, store_phone) => {
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
      const [result] = await connection.execute(sql_statement, [name, email, hashedPassword, 'owner', age, sex, phone])

      if (result.affectedRows) {
        const sql_statement_store = `
          INSERT INTO
            stores
            (
              name,
              address, 
              phone
            )
          VALUES
            (
              ?,
              ?,
              ?
            )
        `
        const [resStore] = await connection.execute(sql_statement_store, [store_name, store_address, store_phone])
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


const addEmployeeRepo = async (connection, name, email, password, storeId, userRole) => {
  try {
    const saltRounds = 10

    const sql_statement = `
      INSERT INTO
        users
        (
          name,
          email, 
          password,
          store_id,
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
      const [result] = await connection.execute(sql_statement, [name, email, hashedPassword, storeId, userRole])
      
      return result.insertId
    }
  } catch (error) {
    throw error
  }
}


const loginRepo = async (connection, email, password) => {
  try {
    const sql_statement = `
      SELECT
        u.*,
        s.name store_name
      FROM
        users AS u
      INNER JOIN
        stores AS s
      ON
        u.store_id = s.id
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


module.exports = { addOwnerRepo, addEmployeeRepo, loginRepo }