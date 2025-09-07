const allProdutcs = async (connection, limit, offset, type) => {
  console.log(limit)
  console.log(offset)
  try {
    let sql_statement = `SELECT * FROM products`
    const sqlParams = []

    if (type) {
      sql_statement += ` WHERE type = ?`
      sqlParams.push(type)
    }

    sql_statement += ` LIMIT ? OFFSET ?`

    console.log(sql_statement)
    
    sqlParams.push(limit.toString())
    sqlParams.push(offset.toString())

    console.log(sqlParams)

    const [result] = await connection.execute(sql_statement, sqlParams)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const detailSupplierRepo = async (connection, id) => {
  try {
    const sql_statement = `
      SELECT
        *
      FROM
        supplier
      WHERE
        id = ?
      LIMIT
        1
    `
    const [result] = await connection.execute(sql_statement, [id])
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const addProductRepo = async (connection, store_id, name, type, price, stock, unit, ingredient) => {
  try {
    const sql_statement = `
      INSERT INTO
        products
        (
          store_id,
          name,
          type,
          price,
          stock,
          unit
        )
      VALUES
        (
          ?,
          ?,
          ?,
          ?,
          ?,
          ?
        )
    `
    const [result] = await connection.execute(sql_statement, [1, name, type, price, stock, unit])
    if (result && ingredient.length > 0) {
      
    }
    return result.insertId
  } catch (error) {
    throw new Error(error)
  }
}

module.exports = { allProdutcs, detailSupplierRepo, addProductRepo }