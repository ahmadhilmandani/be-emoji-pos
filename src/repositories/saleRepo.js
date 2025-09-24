const { getDetailIngredientsRepo, updateIngredientRepo } = require("./ingredientsRepo")

const getProductSalesCatalogRepo = async (connection, limit, offset, store_id, type) => {
  try {
    // First Query for physical & service product
    const sqlParamsOne = []
    const sqlPartsOne = [
      `SELECT p.*, pps.stock`,
      "FROM products AS p",
      "LEFT JOIN product_physical_stock AS pps",
      "ON p.id = pps.product_id",
      "WHERE (p.type = 'produk_fisik' OR p.type = 'layanan')",
      "AND p.store_id = ?"
    ]

    sqlParamsOne.push(store_id)
    sqlPartsOne.push("LIMIT ? OFFSET ?")
    sqlParamsOne.push(limit.toString(), offset.toString())

    const sqlStatementOne = sqlPartsOne.join(" ")
    const [resultOne] = await connection.execute(sqlStatementOne, sqlParamsOne)

    // Second Query for olahan
    const sqlParamsTwo = []
    const sqlPartsTwo = [
      `SELECT p.*, pi.quantity, i.name AS ingredient_name, i.stock, i.min_stock, i.unit AS ingredient_unit`,
      "FROM products AS p",
      "INNER JOIN product_ingredients AS pi",
      "ON p.id = pi.product_id",
      "INNER JOIN ingredients AS i",
      "ON pi.ingredient_id = i.id",
      "WHERE type = 'produk_olahan'",
      "AND p.store_id = ?"
    ]

    sqlParamsTwo.push(store_id)
    sqlPartsTwo.push("LIMIT ? OFFSET ?")
    sqlParamsTwo.push(limit.toString(), offset.toString())


    const sqlStatementTwo = sqlPartsTwo.join(" ")
    const [resultTwo] = await connection.execute(sqlStatementTwo, sqlParamsTwo)

    const formatted = Object.values(
      resultTwo.reduce((acc, item) => {
        if (!acc[item.name]) {
          acc[item.name] = {
            id: item.id,
            store_id: item.store_id,
            name: item.name,
            type: item.type,
            phys_prod_min_stock: item.phys_prod_min_stock,
            price: item.price,
            unit: item.unit,
            created_at: item.created_at,
            updated_at: item.updated_at,
            ingredients: []
          }
        }

        acc[item.name].ingredients.push({
          ingredient_name: item.ingredient_name,
          quantity: item.quantity,
          stock: item.stock,
          min_stock: item.min_stock,
          unit: item.ingredient_unit
        })
        return acc
      }, {})
    )
    
    resultOne.push(...formatted)

    return resultOne
  } catch (error) {
    throw error
  }
}


module.exports = { getProductSalesCatalogRepo }