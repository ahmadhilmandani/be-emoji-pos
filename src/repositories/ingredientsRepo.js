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

const getDetailIngredientsRepo = async (connection, store_id, ingredient_id) => {
  try {
    let sql_statement = `SELECT * FROM ingredients WHERE store_id = ? AND id = ?`
    const sqlParams = [store_id, ingredient_id]

    const [result] = await connection.execute(sql_statement, sqlParams)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const updateIngredientRepo = async (connection, name, price, stock, min_stock, unit, id, store_id) => {
  try {
    let sql_statement = `UPDATE ingredients SET name = ?, price = ?, stock = ?, min_stock = ?, unit = ? WHERE store_id = ? AND id = ? `

    const [result] = await connection.execute(sql_statement, [name, price, stock, min_stock, unit, store_id, id])
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const updateIngredientStockRepo = async (connection, ingredients) => {
  try {
    for (let index = 0; index < ingredients.length; index++) {
      let sql_statement = `UPDATE ingredients SET stock = ? WHERE id = ? `
      await connection.execute(sql_statement, [ingredients[index].current_stock + ingredients[index].stock, ingredients[index].id])
    }

    return "Success"
  } catch (error) {
    throw new Error(error)
  }
}

const addIngredientsRepo = async (connection, store_id, name, stock, min_stock, unit, price) => {
  try {
    const sql_statement = `
      INSERT INTO
        ingredients
        (
          store_id,
          name,
          stock,
          min_stock,
          unit,
          price,
          is_delete
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
    const [result] = await connection.execute(sql_statement, [store_id, name, stock, min_stock, unit, price, 0])
    // if (result) {
    //   const sqlIngredientStock = [
    //     "INSERT",
    //     "INTO ingredient_stock (ingredient_id, stock)",
    //     "VALUES (?, ?)",
    //   ]
      
    //   const sqlIngredientStockJoin = sqlIngredientStock.join(" ")
    //   const sqlParams = [result.insertId, 0]
    //   await connection.execute(sqlIngredientStockJoin, sqlParams)
    // }
    return result.insertId
  } catch (error) {
    throw error
  }
}

module.exports = { allIngredientsRepo, addIngredientsRepo, getDetailIngredientsRepo, updateIngredientStockRepo, updateIngredientRepo }