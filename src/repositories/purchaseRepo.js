const ShortUniqueId = require("short-unique-id")
const { randomUUID } = new ShortUniqueId({ length: 8 })

const allPurchaseRepo = async (connection, store_id, limit, offset, type) => {
  try {
    const sqlStatement = [
      "SELECT p.id, p.purchase_code, p.store_id, p.total_amount, s.name supplier_name, s.phone supplier_phone, s.is_delete supplier_is_delete",
      "FROM purchases AS p",
      "INNER JOIN suppliers AS s",
      "ON p.supplier_id = s.id",
      "WHERE p.store_id = ?",
      "AND p.type = ?"
      // "LIMIT ? OFFSET ?"
    ]

    const sqlParams = []

    const sqlPart = sqlStatement.join(" ")

    sqlParams.push(store_id)
    sqlParams.push(type)
    // sqlParams.push(limit.toString())
    // sqlParams.push(offset.toString())

    const [result] = await connection.execute(sqlPart, sqlParams)
    return result
  } catch (error) {
    throw error
  }
}

const getPurchaseWithDetailsRepo = async (connection, store_id, purchase_id, type) => {
  try {
    const sqlParts = [
      `SELECT`,
      `p.id AS purchase_id, p.purchase_code, p.total_amount, p.type, p.created_at,`,
      `pd.id AS purchase_detail_id, pd.ingredient_id, pd.phys_product_id, pd.quantity, pd.price, pd.discount, pd.subtotal,`,
      `${type === 'ingredient' ? 'i.name AS item_name, i.stock, i.is_delete item_is_delete' : 'p2.name AS item_name, p2.is_delete item_is_delete'}`,
      `FROM purchases p`,
      `INNER JOIN purchase_details pd ON pd.purchase_id = p.id`,
      `${type === 'ingredient'
        ? 'INNER JOIN ingredients i ON i.id = pd.ingredient_id'
        : 'INNER JOIN products p2 ON p2.id = pd.phys_product_id'}`,
      `WHERE p.id = ?`,
      `AND p.store_id = ?`
    ]

    const sqlStatement = sqlParts.join(" ");
    const [result] = await connection.execute(sqlStatement, [purchase_id, store_id])
    console.log(result)

    return result;
  } catch (error) {
    throw error
  }
};


const addPurchaseWithDetailsRepo = async (connection, store_id, supplier_id, user_id, total_amount, purchase_detail, store_name, type) => {
  try {

    const store_name_acronym = (store_name.match(/\p{L}+|\p{N}+/gu) || []).map(w => w[0].toUpperCase()).join('')

    const purchase_code = store_name_acronym + ' - ' + randomUUID()

    const sqlParts = [
      `INSERT`,
      `INTO purchases (purchase_code, store_id, supplier_id, user_id, total_amount, type)`,
      "VALUES (?, ?, ?, ?, ?, ?)"
    ]

    const sqlStatement = sqlParts.join(" ");
    const [result] = await connection.execute(sqlStatement, [purchase_code, store_id, supplier_id, user_id, total_amount, type]);

    if (result) {
      const sqlPartPurchaseDetail = [
        `INSERT`,
        `INTO purchase_details (purchase_id, ingredient_id, phys_product_id, quantity, price, discount, subtotal)`,
        "VALUES ?"
      ]

      const sqlPartUpdateStock = [
        `UPDATE`,
        `${type == 'ingredient' ? 'ingredients' : 'product_physical_stock'}`,
        `SET stock = ?`,
        `WHERE ${type == 'ingredient' ? 'id = ?' : 'product_id = ?'}`
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
      await connection.query(sqlStatementPurchaseDetail, [sqlParamsPurchaseDetail])
    }

    return result
  } catch (error) {
    throw error
  }
}

module.exports = { addPurchaseWithDetailsRepo, allPurchaseRepo, getPurchaseWithDetailsRepo }