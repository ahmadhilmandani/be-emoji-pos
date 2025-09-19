const connectDb = require("../config/db")
const { addPurchaseWithDetailsRepo } = require("../repositories/purchaseRepo")

const addPurchaseWithDetails = async (req, res, next) => {
  const pool = await connectDb()
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()
    const { user_id, store_id } = req.user
    const { supplier_id, total_amount, purchase_detail } = req.body

    const result = await addPurchaseWithDetailsRepo(connection, store_id, supplier_id, user_id, total_amount, purchase_detail)

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

module.exports = { addPurchaseWithDetails }