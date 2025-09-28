const { getDetailIngredientsRepo, updateIngredientRepo } = require("./ingredientsRepo")
const ShortUniqueId = require("short-unique-id")


const { randomUUID } = new ShortUniqueId({ length: 8 })

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
    let [resultOne] = await connection.execute(sqlStatementOne, sqlParamsOne)
    resultOne.forEach(val => {
      val.stock = parseFloat(val.stock)
      val.phys_prod_min_stock = parseFloat(val.phys_prod_min_stock)
    })
    // Second Query for olahan
    const sqlParamsTwo = []
    const sqlPartsTwo = [
      `SELECT p.*, pi.quantity, i.id AS ingredient_id, i.name AS ingredient_name, i.stock, i.min_stock, i.unit AS ingredient_unit`,
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
          id: item.ingredient_id,
          ingredient_name: item.ingredient_name,
          quantity: parseFloat(item.quantity),
          stock: parseFloat(item.stock),
          min_stock: parseFloat(item.min_stock),
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

const getSalesHistoryRepo = async (connection, page = 1, limit = 10, store_id) => {
  try {
    const offset = (page - 1) * limit;

    const sqlCount = `SELECT COUNT(*) as total FROM sales`;
    const [countResult] = await connection.execute(sqlCount);
    const totalData = countResult[0].total;
    const totalPages = Math.ceil(totalData / limit);

    const sql = `
      SELECT s.id, s.invoice_number, s.user_id, s.final_total_amount, s.paid_amount, s.change_amount, 
             s.created_at, u.name as cashier_name
      FROM sales s
      INNER JOIN users u ON u.id = s.user_id
      WHERE s.store_id = ? 
      ORDER BY s.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const [rows] = await connection.execute(sql, [store_id, limit.toString(), offset.toString()]);

    return {
      currentPage: page,
      totalPages,
      totalData,
      sales: rows
    };
  } catch (error) {
    throw error;
  }
};


const postSaleRepo = async (connection, store_id, user_id, sales, reguler_discount, emoji_percentage_discount = null, emoji_discount = null, undiscount_total_amount, final_total_amount, paid_amount, change_amount, store_name) => {
  try {

    const store_name_acronym = (store_name.match(/\p{L}+|\p{N}+/gu) || []).map(w => w[0].toUpperCase()).join('')
    const purchase_code = store_name_acronym + ' # ' + randomUUID()

    const sqlPartSale = [
      `INSERT`,
      `INTO sales (store_id, invoice_number, user_id, reguler_discount, emoji_percentage_discount, emoji_discount, undiscount_total_amount, final_total_amount, paid_amount, change_amount)`,
      "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ]
    const sqlStatementSale = sqlPartSale.join(" ")

    const [resSale] = await connection.execute(sqlStatementSale, [store_id, purchase_code, user_id, reguler_discount, emoji_percentage_discount, emoji_discount, undiscount_total_amount, final_total_amount, paid_amount, change_amount])

    const sqlPartSaleDetail = [
      `INSERT`,
      `INTO sales_details (sale_id, product_id, quantity, price, subtotal)`,
      "VALUES ?"
    ]

    const sqlParamsSaleDetail = []

    const sqlUpdateStockIngredient = `UPDATE ingredients SET stock = ? where id = ?`
    const sqlUpdateStocProdPhysStock = `UPDATE product_physical_stock SET stock = ? where product_id = ?`

    for (const val of sales) {
      sqlParamsSaleDetail.push([resSale.insertId, val.id, val.used_product_qty, val.price, val.price * val.used_product_qty])

      if (val.type == 'produk_olahan') {
        for (const ingredient of val.ingredients) {
          if ((ingredient.stock - (ingredient.quantity * val.used_product_qty)) < 0) {
            throw new Error("stock kurang")
          }
          await connection.execute(sqlUpdateStockIngredient, [ingredient.stock - (ingredient.quantity * val.used_product_qty), ingredient.id])

        }
      } else if (val.type == 'produk_fisik') {

        if ((val.current_stock - val.used_product_qty) < 0) {
          throw new Error("stock kurang")
        }
        await connection.execute(sqlUpdateStocProdPhysStock, [val.current_stock - val.used_product_qty, val.id])
      }
    }
    const sqlStatementSaleDetail = sqlPartSaleDetail.join(" ")
    await connection.query(sqlStatementSaleDetail, [sqlParamsSaleDetail])
    return resSale.insertId

  } catch (error) {
    throw error
  }
}


module.exports = { getProductSalesCatalogRepo, postSaleRepo, getSalesHistoryRepo }