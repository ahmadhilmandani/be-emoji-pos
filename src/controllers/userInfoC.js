const connectDb = require("../config/db")
const { allUserInfo, getUserDetailRepo } = require("../repositories/userInfoRepo")


const getAllUserInfo = async (req, res, next) => {
  const pool = await connectDb()
  const connection = await pool.getConnection()

  try {
    const { store_id } = req.user
    let { page, limit } = req.query
    page = parseInt(page) || 1
    limit = parseInt(limit) || 10
    const offset = (page - 1) * limit
    const user_role = req.query?.user_role || null

    const result = await allUserInfo(connection, store_id, limit, offset, user_role)

    return res.status(200).json({
      'is_error': false,
      'users_info': result
    })

  } catch (error) {
    await connection.rollback()
    next(error)
  } finally {
    await connection.release()
  }
}


const getDetailUserC = async (req, res, next) => {
  const pool = await connectDb()
  const connection = await pool.getConnection()

  try {
    const { id } = req.params
    const { store_id } = req.user

    const result = await getUserDetailRepo(connection, id, store_id)

    return res.status(200).json({
      'is_error': false,
      'users_info': result
    })

  } catch (error) {
    await connection.rollback()
    next(error)
  } finally {
    await connection.release()
  }
}

module.exports = { getAllUserInfo, getDetailUserC }