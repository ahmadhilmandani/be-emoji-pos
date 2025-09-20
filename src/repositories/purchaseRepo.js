const ShortUniqueId = require("short-unique-id")
const { randomUUID } = new ShortUniqueId({ length: 8 })

const addPurchaseWithDetailsRepo = async (connection, store_id, supplier_id, user_id, total_amount, purchase_detail, store_name) => {
  try {

    const store_name_acronym = (store_name.match(/\p{L}+|\p{N}+/gu) || []).map(w => w[0].toUpperCase()).join('')


    const purchase_code = store_name_acronym + ' - ' + randomUUID() 

    // console.log(store_name_acronym)
    // console.log(purchase_code)
    // console.log(store_id)

    const sqlParts = [
      `INSERT`,
      `INTO purchases (purchase_code, store_id, supplier_id, user_id, total_amount)`,
      "VALUES (?, ?, ?, ?, ?)"
    ]

    const sqlStatement = sqlParts.join(" ");
    const [result] = await connection.execute(sqlStatement, [purchase_code, store_id, supplier_id, user_id, total_amount]);

    if (result) {
      const sqlPartPurchaseDetail = [
        `INSERT`,
        `INTO purchase_details (purchase_id, ingredient_id, phys_product_id, quantity, price, discount, subtotal)`,
        "VALUES ?"
      ]

      const sqlPartUpdateStock = [
        `UPDATE`,
        `${purchase_detail?.ingredient_id ? 'ingredient_stock' : 'product_physical_stock'}`,
        `SET stock = ?`,
        `WHERE ${purchase_detail?.ingredient_id ? 'ingredient_id = ?' : 'product_id = ?'}`
      ]

      const sqlParamsPurchaseDetail = []
      let sqlParamUpdateStock = null


      for (let index = 0; index < purchase_detail.length; index++) {
        sqlParamsPurchaseDetail.push([result.insertId, purchase_detail[index].ingredient_id || null, purchase_detail[index]?.phys_product_id, purchase_detail[index].quantity, purchase_detail[index].price, purchase_detail[index]?.discount || 0, purchase_detail[index].subtotal])

        sqlParamUpdateStock = [Number(purchase_detail[index].current_qty) + Number(purchase_detail[index].quantity)]
        sqlParamUpdateStock.push(purchase_detail[index]?.ingredient_id ? purchase_detail[index].ingredient_id : purchase_detail[index].phys_product_id)
        // console.log(sqlParamsPurchaseDetail)
        // console.log(sqlParamUpdateStock)

        const sqlStatementUpdateStock = sqlPartUpdateStock.join(" ")
        await connection.execute(sqlStatementUpdateStock, sqlParamUpdateStock)

      }


      // purchase_detail.forEach(val => {
      //   sqlParamsPurchaseDetail.push([result.insertId, val?.ingredient_id, val?.phys_product_id, val.quantity, val.price, val?.discount || 0, val.subtotal])

      //   sqlParamUpdateStock.push([val.current_qty + val.quantity, val?.ingredient_id ? val.ingredient_id : val.phys_product_id])


      //   const sqlStatementUpdateStock = sqlPartUpdateStock.join(" ")
      //   await connection.execute(sqlStatementUpdateStock, sqlParamUpdateStock)  
      // })

      const sqlStatementPurchaseDetail = sqlPartPurchaseDetail.join(" ")
      console.log(sqlParamsPurchaseDetail)
      await connection.query(sqlStatementPurchaseDetail, [sqlParamsPurchaseDetail])

    }

    return result;
  } catch (error) {
    throw error
  }
}

module.exports = { addPurchaseWithDetailsRepo }