const connectDb = require("../config/db")
const { getStoreDetailRepo } = require("../repositories/storeRepo")


const getDetailStore = async (req, res, next) => {
  const pool = await connectDb()
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    const { id } = req.params

    const result = await getStoreDetailRepo(connection, id)
    return res.status(200).json({
      'is_error': false,
      'store': result
    })

  } catch (error) {
    await connection.rollback()
    next(error)
  } finally {
    await connection.release()
  }
}


const updateStore = async (req, res, next) => {
  const pool = await connectDb()
  const connection = await pool.getConnection()

  try {
    if (req.user.role !== 'owner') {
      throw new Error("Anda Bukan Owner")
    }

    await connection.beginTransaction()

    const { id } = req.params
    const { name, address, phone, percentage_max_emoji_disc } = req.body
    const updated_at = new Date()

    const result = await updateStoreRepo(connection, id, name, address, phone, percentage_max_emoji_disc, updated_at)
    return res.status(200).send({
      'is_error': false,
      'msg': result
    })

  } catch (error) {
    await connection.rollback()
    next(error)
  } finally {
    await connection.release()
  }
}


module.exports = { getDetailStore, updateStore }