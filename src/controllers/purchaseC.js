const connectDb = require("../config/db")
const { addPurchaseWithDetailsRepo, allPurchaseRepo, updatePurchaseWithDetailsRepo, getPurchaseWithDetailsRepo } = require("../repositories/purchaseRepo")

const getAllPurchase = async (req, res, next) => {
  const pool = await connectDb()
  const connection = await pool.getConnection()

  try {
    const { store_id } = req.user
    let { page, limit, type } = req.query
    page = parseInt(page) || 1
    limit = parseInt(limit) || 10
    const offset = (page - 1) * limit

    const result = await allPurchaseRepo(connection, store_id, limit, offset, type)

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

const getPurchaseWithDetails = async (req, res, next) => {
  const pool = await connectDb()
  const connection = await pool.getConnection()

  try {
    const { store_id} = req.user
    const { purchase_id } = req.params
    const { type } = req.query

    const result = await getPurchaseWithDetailsRepo(connection, store_id, purchase_id, type)

    return res.status(200).json({
      'is_error': false,
      'purchase': result
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
    const { supplier_id, total_amount, purchase_detail, type } = req.body

    const result = await addPurchaseWithDetailsRepo(connection, store_id, supplier_id, user_id, total_amount, purchase_detail, store_name, type)

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

module.exports = { addPurchaseWithDetails, getAllPurchase, getPurchaseWithDetails }