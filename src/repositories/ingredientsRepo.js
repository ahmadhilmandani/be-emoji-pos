const allIngredientsRepo = async (connection, store_id, limit, offset) => {
  try {
    let sql_statement = `SELECT * FROM ingredients WHERE store_id = ?`
    const sqlParams = [store_id]

    sql_statement += ` LIMIT ? OFFSET ?`

    sqlParams.push(limit.toString())
    sqlParams.push(offset.toString())

    const [result] = await connection.execute(sql_statement, sqlParams)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const addIngredientsRepo = async (connection, store_id, name, stock, min_stock, unit) => {
  try {
    const sql_statement = `
      INSERT INTO
        ingredients
        (
          store_id,
          name,
          stock,
          min_stock,
          unit
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
    const [result] = await connection.execute(sql_statement, [store_id, name, stock, min_stock, unit])
    return result.insertId
  } catch (error) {
    throw error
  }
}

module.exports = { allIngredientsRepo, addIngredientsRepo }