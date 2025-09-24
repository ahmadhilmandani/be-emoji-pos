const connectDb = require("../config/db")
const { allProdutcs } = require("../repositories/productRepo")
const { getProductSalesCatalogRepo } = require("../repositories/saleRepo")

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


module.exports = { getProductSalesCatalog }