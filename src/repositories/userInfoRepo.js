const allUserInfo = async (connection, store_id, limit, offset, user_role) => {
  try {
    let sql_statement = `SELECT id, store_id, name, email, user_role, age, sex, phone FROM users WHERE store_id = ? AND is_delete = 0`
    const sqlParams = [store_id]

    if (user_role) {
      sql_statement += ` AND user_role = ?`
      sqlParams.push(user_role)
    }

    // sql_statement += ` LIMIT ? OFFSET ?`

    // sqlParams.push(limit.toString())
    // sqlParams.push(offset.toString())

    const [result] = await connection.execute(sql_statement, sqlParams)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getUserDetailRepo = async (connection, userId, storeId) => {
  try {
    const arrSql = [
      `SELECT id, name, email, store_id, user_role, age, sex, phone, created_at, updated_at`,
      `FROM users`,
      `WHERE id = ? AND store_id = ? AND is_delete = 0`
    ]
    const sqlStatement = arrSql.join(" ")

    const [result] = await connection.execute(sqlStatement, [userId, storeId])

    if (result.length === 0) {
      throw new Error("Employee not found")
    }

    return result[0]
  } catch (error) {
    throw error
  }
}


module.exports = { allUserInfo, getUserDetailRepo }