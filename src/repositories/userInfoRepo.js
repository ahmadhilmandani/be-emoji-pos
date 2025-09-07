const allUserInfo = async (connection, store_id, limit, offset, user_role) => {
  try {
    let sql_statement = `SELECT id, store_id, name, email, user_role, age, sex, phone FROM users WHERE store_id = ?`
    const sqlParams = [store_id]

    if (user_role) {
      sql_statement += ` AND user_role = ?`
      sqlParams.push(user_role)
    }

    sql_statement += ` LIMIT ? OFFSET ?`

    sqlParams.push(limit.toString())
    sqlParams.push(offset.toString())

    const [result] = await connection.execute(sql_statement, sqlParams)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

module.exports = { allUserInfo }