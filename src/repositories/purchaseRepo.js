const addPurchaseWithDetailsRepo = async (connection, store_id, supplier_id, user_id, total_amount, purchase_detail) => {
  try {

    const sqlParts = [
      `INSERT`,
      `INTO purchases (store_id, supplier_id, user_id, total_amount)`,
      "VALUES (?, ?, ?, ?)"
    ]

    const sqlStatement = sqlParts.join(" ");
    const [result] = await connection.execute(sqlStatement, store_id, supplier_id, user_id, total_amount);

    if (result) {
      const sqlPartPurchaseDetail = [
        `INSERT`,
        `INTO purchase_details (purchase_id, ingredient_id, phys_product_id, quantity, price, discount, subtotal)`,
        "VALUES ?"
      ]

      const sqlPartUpdateStock = [
        `UPDATE`,
        `${val?.ingredient_id ? 'ingredient_stock' : 'product_physical_stock'}`,
        `SET stock = ?`,
        `WHERE ${val?.ingredient_id ? 'ingredient_id = ?' : 'product_id = ?'}`
      ]

      const sqlParamsPurchaseDetail = []
      const sqlParamUpdateStock = []


      purchase_detail.forEach(val => {
        sqlParamsPurchaseDetail.push([result.insertId, val?.ingredient_id, val?.phys_product_id, val.quantity, val.price, val?.discount || 0, (val.quantity * val.price) - (val.quantity * val?.discount || 0)])

        sqlParamUpdateStock.push([val.current_qty + val.quantity, val?.ingredient_id ? val.ingredient_id : val.phys_product_id])
      })

      const sqlStatementPurchaseDetail = sqlPartPurchaseDetail.join(" ")
      await connection.query(sqlStatementPurchaseDetail, [sqlParamsPurchaseDetail])

      const sqlStatementUpdateStock = sqlPartUpdateStock.join(" ")
      await connection.execute(sqlStatementUpdateStock, sqlParamUpdateStock)      
    }

    return result;
  } catch (error) {
    throw error
  }
}

module.exports = { addPurchaseWithDetailsRepo }