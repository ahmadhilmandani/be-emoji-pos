const connectDb = require("../config/db")
const { getProductSalesCatalogRepo, postSaleRepo } = require("../repositories/saleRepo")

const getProductSalesCatalog = async (req, res, next) => {
  const pool = await connectDb()
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    const storeId = req.user.store_id
    let { page, limit } = req.query
    page = parseInt(page) || 1
    limit = parseInt(limit) || 10
    const offset = (page - 1) * limit
    const type = req.query?.type || null

    const result = await getProductSalesCatalogRepo(connection, limit, offset, storeId, type)

    return res.status(200).json({
      'is_error': false,
      'products': result
    })
  } catch (error) {
    await connection.rollback()
    next(error)
  } finally {
    await connection.release()
  }
}

const postSale = async (req, res, next) => {
  const pool = await connectDb()
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    const { store_id, user_id, store_name } = req.user
    const { sales, reguler_discount, emoji_percentage_discount, emoji_discount, total_amount, paid_amount, change_amount } = req.body
    
    const result = await postSaleRepo(connection, store_id, user_id, sales, reguler_discount, emoji_percentage_discount, emoji_discount, total_amount, paid_amount, change_amount, store_name)
    await connection.commit()

    return res.status(200).json({
      'is_error': false,
      'id_sale': result
    })


  } catch (error) {
    await connection.rollback()
    next(error)
  } finally {
    await connection.release()
  }
}

module.exports = { getProductSalesCatalog, postSale }