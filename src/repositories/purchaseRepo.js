const ShortUniqueId = require("short-unique-id")
const { randomUUID } = new ShortUniqueId({ length: 8 })

const allPurchaseRepo = async (connection, store_id, limit, offset) => {
  try {
    const sqlStatement = [
      "SELECT p.id, p.purchase_code, p.store_id, p.total_amount, s.name supplier_name, s.phone supplier_phone",
      "FROM purchases AS p",
      "INNER JOIN suppliers AS s",
      "ON p.supplier_id = s.id",
      "WHERE p.store_id = ?",
      "LIMIT ? OFFSET ?"
    ]

    const sqlParams = []

    const sqlPart = sqlStatement.join(" ")

    sqlParams.push(store_id)
    sqlParams.push(limit.toString())
    sqlParams.push(offset.toString())

    const [result] = await connection.execute(sqlPart, sqlParams)
    return result
  } catch (error) {
    throw error
  }
}

const addPurchaseWithDetailsRepo = async (connection, store_id, supplier_id, user_id, total_amount, purchase_detail, store_name) => {
  try {

    const store_name_acronym = (store_name.match(/\p{L}+|\p{N}+/gu) || []).map(w => w[0].toUpperCase()).join('')

    const purchase_code = store_name_acronym + ' - ' + randomUUID()

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
        `${purchase_detail?.ingredient_id ? 'ingredients' : 'product_physical_stock'}`,
        `SET stock = ?`,
        `WHERE ${purchase_detail?.ingredient_id ? 'id = ?' : 'product_id = ?'}`
      ]

      const sqlParamsPurchaseDetail = []
      let sqlParamUpdateStock = null


      for (let index = 0; index < purchase_detail.length; index++) {
        sqlParamsPurchaseDetail.push([result.insertId, purchase_detail[index].ingredient_id || null, purchase_detail[index]?.phys_product_id || null, purchase_detail[index].quantity, purchase_detail[index].price, purchase_detail[index]?.discount || 0, purchase_detail[index].subtotal])

        sqlParamUpdateStock = [Number(purchase_detail[index].current_qty) + Number(purchase_detail[index].quantity)]
        sqlParamUpdateStock.push(purchase_detail[index]?.ingredient_id ? purchase_detail[index].ingredient_id : purchase_detail[index].phys_product_id)

        const sqlStatementUpdateStock = sqlPartUpdateStock.join(" ")
        await connection.execute(sqlStatementUpdateStock, sqlParamUpdateStock)

      }

      const sqlStatementPurchaseDetail = sqlPartPurchaseDetail.join(" ")
      console.log(sqlParamsPurchaseDetail)
      await connection.query(sqlStatementPurchaseDetail, [sqlParamsPurchaseDetail])

    }

    return result;
  } catch (error) {
    throw error
  }
}

module.exports = { addPurchaseWithDetailsRepo, allPurchaseRepo }