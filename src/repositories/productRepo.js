const { getDetailIngredientsRepo, updateIngredientRepo } = require("./ingredientsRepo")

const allProdutcs = async (connection, limit, offset, store_id, type) => {
  try {
    const sqlParams = []
    const sqlParts = [
      `SELECT p.* ${type == "produk_fisik" ? ', pps.id AS phys_prod_id, pps.stock AS stock' : ''}`,
      "FROM products AS p"
    ]

    if (type === "produk_fisik") {
      sqlParts.push("LEFT JOIN product_physical_stock AS pps ON p.id = pps.product_id");
    }

    if (type) {
      sqlParts.push("WHERE p.type = ? AND p.store_id = ?");
      sqlParams.push(type, store_id);
    } else {
      sqlParts.push("WHERE p.store_id = ?");
      sqlParams.push(store_id);
    }

    sqlParts.push("LIMIT ? OFFSET ?");
    sqlParams.push(limit.toString(), offset.toString())

    const sqlStatement = sqlParts.join(" ");
    const [result] = await connection.execute(sqlStatement, sqlParams);

    return result;
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

const addProductRepo = async (connection, store_id, name, type, phys_prod_min_stock, price, unit, ingredient) => {
  try {
    const sql_statement = `
      INSERT INTO
        products
        (
          store_id,
          name,
          type,
          phys_prod_min_stock,
          price,
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
    const [result] = await connection.execute(sql_statement, [store_id, name, type, phys_prod_min_stock, price, unit])
    if (result) {
      if (type == 'produk_olahan') {
        if (!ingredient || ingredient.length == 0) {
          throw new Error("Sertakan Bahan Baku")
        }
        let param_sql_ingredient = []

        ingredient.forEach((val) => {
          param_sql_ingredient.push([result.insertId, val.id, val.qty])
        })

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

      else if (type == 'produk_fisik') {
        const sql_statement_phys_prod = [
          "INSERT",
          "INTO product_physical_stock (product_id, stock)",
          "VALUES (?, ?)"
        ]

        const rawSql = sql_statement_phys_prod.join(" ")

        await connection.execute(rawSql, [result.insertId, 0])
      }
    }
    return result.insertId
  } catch (error) {
    throw error
  }
}


module.exports = { allProdutcs, detailSupplierRepo, addProductRepo }