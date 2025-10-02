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


const getProductDetailRepo = async (connection, product_id) => {
  try {
    const sqlPartsProduct = [
      "SELECT p.id, p.store_id, p.name, p.type, p.phys_prod_min_stock, p.price, p.unit",
      "FROM products p",
      "WHERE p.id = ?"
    ]
    const sqlStatementProduct = sqlPartsProduct.join(" ")

    const [productRows] = await connection.execute(sqlStatementProduct, [product_id])
    if (productRows.length === 0) {
      throw new Error("Product not found")
    }
    const product = productRows[0]

    if (product.type === "produk_olahan") {
      const sqlPartsIngredient = [
        "SELECT pi.ingredient_id, i.name as ingredient_name, pi.quantity, i.stock",
        "FROM product_ingredients pi",
        "JOIN ingredients i ON i.id = pi.ingredient_id",
        "WHERE pi.product_id = ?"
      ]
      const sqlStatementIngredient = sqlPartsIngredient.join(" ")
      const [ingredientRows] = await connection.execute(sqlStatementIngredient, [product_id])
      product.ingredients = ingredientRows
    } else if (product.type === "produk_fisik") {
      const sqlPartsStock = [
        "SELECT stock",
        "FROM product_physical_stock",
        "WHERE product_id = ?"
      ]
      const sqlStatementStock = sqlPartsStock.join(" ")
      const [stockRows] = await connection.execute(sqlStatementStock, [product_id])
      product.stock = stockRows.length > 0 ? stockRows[0].stock : 0
    }

    return product
  } catch (error) {
    throw error
  }
};


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


const updateProductRepo = async (connection, product_id, name, type, phys_prod_min_stock, price, unit, ingredient) => {
  try {
    const sqlPartsUpdate = [
      "UPDATE products",
      "SET name = ?, type = ?, phys_prod_min_stock = ?, price = ?, unit = ?",
      "WHERE id = ?"
    ]
    const sqlStatementUpdate = sqlPartsUpdate.join(" ")
    await connection.execute(sqlStatementUpdate, [name, type, phys_prod_min_stock, price, unit, product_id])

    if (type === "produk_olahan") {
      const sqlPartsDeleteIng = [
        "UPDATE product_ingredients",
        "SET is_delete = 1",
        "WHERE product_id = ?"
      ]
      const sqlStatementDeleteIng = sqlPartsDeleteIng.join(" ")
      await connection.execute(sqlStatementDeleteIng, [product_id])

      if (!ingredient || ingredient.length === 0) {
        throw new Error("Sertakan Bahan Baku")
      }

      const paramSqlIngredient = ingredient.map(val => [product_id, val.id, val.qty, 0])

      const sqlPartsInsertIng = [
        "INSERT INTO product_ingredients",
        "(product_id, ingredient_id, quantity, is_delete)",
        "VALUES ?"
      ]
      const sqlStatementInsertIng = sqlPartsInsertIng.join(" ")
      await connection.query(sqlStatementInsertIng, [paramSqlIngredient])

    } else if (type === "produk_fisik") {
      const sqlPartsCheckStock = [
        "SELECT id",
        "FROM product_physical_stock",
        "WHERE product_id = ?"
      ]
      const sqlStatementCheckStock = sqlPartsCheckStock.join(" ")
      const [rows] = await connection.execute(sqlStatementCheckStock, [product_id])

      if (rows.length === 0) {
        const sqlPartsInsertStock = [
          "INSERT INTO product_physical_stock",
          "(product_id, stock)",
          "VALUES (?, ?)"
        ]
        const sqlStatementInsertStock = sqlPartsInsertStock.join(" ")
        await connection.execute(sqlStatementInsertStock, [product_id, 0])
      }
    }

    return true
  } catch (error) {
    throw error
  }
}



module.exports = { allProdutcs, addProductRepo, getProductDetailRepo, updateProductRepo }