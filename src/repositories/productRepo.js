const allProdutcs = async (connection, limit, offset, type) => {
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
    throw error
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
    const [result] = await connection.execute(sql_statement, [store_id, name, type, price, stock, unit])
    if (result && ingredient.length > 0) {
      let param_sql_ingredient = []

      for (let index = 0; index < ingredient.length; index++) {
       param_sql_ingredient.push([result.insertId, ingredient[index].id, ingredient[index].qty])
      }

      console.log(ingredient)
      console.log(param_sql_ingredient)
      
      const sql_statement_product_ingredients = `
        INSERT INTO
          product_ingredients
          (
            product_id,
            ingredient_id,
            quantity
          )
        VALUES ?
      `
      const resultProdIngredient = await connection.query(sql_statement_product_ingredients, [param_sql_ingredient])
    }
    return result.insertId
  } catch (error) {
    throw error
  }
}

module.exports = { allProdutcs, detailSupplierRepo, addProductRepo }