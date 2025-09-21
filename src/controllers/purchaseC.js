const connectDb = require("../config/db")
const { addPurchaseWithDetailsRepo, allPurchaseRepo } = require("../repositories/purchaseRepo")

const getAllPurchase = async (req, res, next) => {
  const pool = await connectDb()
  const connection = await pool.getConnection()

  try {
    const { store_id } = req.user
    let { page, limit } = req.query
    page = parseInt(page) || 1
    limit = parseInt(limit) || 10
    const offset = (page - 1) * limit

    const result = await allPurchaseRepo(connection, store_id, limit, offset)

    return res.status(200).json({
      'is_error': false,
      'purchases': result
    })

  } catch (error) {
    await connection.rollback()
    next(error)
  } finally {
    await connection.release()
  }
}

const addPurchaseWithDetails = async (req, res, next) => {
  const pool = await connectDb()
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()
    const { user_id, store_id, store_name } = req.user
    const { supplier_id, total_amount, purchase_detail } = req.body

    const result = await addPurchaseWithDetailsRepo(connection, store_id, supplier_id, user_id, total_amount, purchase_detail, store_name)

    await connection.commit()

    return res.status(200).json({
      'is_error': false,
      'inserted_id': result
    })
  } catch (error) {
    await connection.rollback()
    next(error)
  } finally {
    await connection.release()
  }
}

module.exports = { addPurchaseWithDetails, getAllPurchase }