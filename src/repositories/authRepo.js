const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const addOwnerRepo = async (connection, email, name, password, age, sex, phone, store_name, store_address, percentage_max_emoji_disc, store_phone) => {
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
              percentage_max_emoji_disc,
              phone
            )
          VALUES
            (
              ?,
              ?,
              ?,
              ?
            )
        `
        const [resStore] = await connection.execute(sql_statement_store, [store_name, store_address, percentage_max_emoji_disc, store_phone])
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


const updateEmployeeRepo = async (connection, userId, name, email, password, userRole, age, sex, phone) => {
  try {
    let arrSql = [
      `UPDATE users`,
      `SET name = ?, email = ?, user_role = ?, age = ?, sex = ?, phone = ?`
    ]
    const params = [name, email, userRole, age, sex, phone]

    if (password) {
      const saltRounds = 10
      const hashedPassword = await bcrypt.hash(password, saltRounds)
      arrSql = [
        `UPDATE users`,
        `SET name = ?, email = ?, user_role = ?, age = ?, sex = ?, phone = ?, password = ?`
      ]
      params.splice(2, 0, hashedPassword)
    }

    arrSql.push(`WHERE id = ?`)
    params.push(userId)

    const sqlStatement = arrSql.join(" ")

    const [result] = await connection.execute(sqlStatement, params)

    if (result.affectedRows === 0) {
      throw new Error("Employee not found or no changes applied")
    }

    return { message: "Employee updated successfully" }
  } catch (error) {
    throw error
  }
}


const softDeleteEmployeeRepo = async (connection, userId) => {
  try {
    const arrSql = [
      `UPDATE users`,
      `SET is_delete = 0`,
      `WHERE id = ?`
    ]
    const sqlStatement = arrSql.join(" ")

    const [result] = await connection.execute(sqlStatement, [userId])

    if (result.affectedRows === 0) {
      throw new Error("Employee not found or already deleted")
    }

    return { message: "Employee soft deleted successfully" }
  } catch (error) {
    throw error
  }
}

const loginRepo = async (connection, email, password) => {
  try {
    const sql_statement = `
      SELECT
        u.*,
        s.name store_name,
        s.percentage_max_emoji_disc percentage_max_emoji_disc
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


module.exports = { addOwnerRepo, addEmployeeRepo, loginRepo, updateEmployeeRepo, softDeleteEmployeeRepo }