const connectDb = require("../config/db")
const { addSupplierRepo, detailSupplierRepo, allSupplierRepo } = require("../repositories/supplierRepo")

const getAllSupplierC = async (req, res, next) => {
  const pool = await connectDb()
  const connection = await pool.getConnection()

  try {
    let { page, limit } = req.query
    page = parseInt(page) || 1
    limit = parseInt(limit) || 10
    const offset = (page - 1) * limit

    const result = await allSupplierRepo(connection, limit, offset)

    return res.status(200).json({
      is_error: false,
      supplier: result
    })
  } catch (error) {
    next(error)
  } finally {
    await connection.release()
  }
}

const getDetailSupplierC = async (req, res, next) => {
  const pool = await connectDb()
  const connection = await pool.getConnection()

  try {
    const { id } = req.params
    const result = await detailSupplierRepo(connection, id)

    return res.status(200).json({
      'is_error': false,
      'supplier': result
    });

  } catch (error) {
    await connection.rollback()
    next(error)
  } finally {
    await connection.release()
  }
}

const addSupplierC = async (req, res, next) => {
  const pool = await connectDb()
  const connection = await pool.getConnection()

  try {
    const { name, phone, address } = req.body
    const result = await addSupplierRepo(connection, name, phone, address)
    return res.status(200).send({
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

module.exports = { getAllSupplierC, getDetailSupplierC, addSupplierC }