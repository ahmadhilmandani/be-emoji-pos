const connectDb = require("../config/db")
const { addProductRepo } = require("../repositories/productRepo")
const { addSupplierRepo, detailSupplierRepo, allSupplierRepo } = require("../repositories/supplierRepo")

const getAllSupplierC = async (req, res, next) => {
  const connection = connectDb()

  try {
    const { page, limit } = req.query
    page = parseInt(page) || 1
    limit = parseInt(limit) || 10
    const offset = (page - 1) * limit

    const result = await allSupplierRepo(connection, limit, offset)

    return res.status(200).json({
      'is_error': false,
      'supplier': result
    })

  } catch (error) {
    await connection.rollback()
    next(error)
  } finally {
    connection.end()
  }
}

const getDetailSupplierC = async (req, res, next) => {
  const connection = connectDb()

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
    connection.end()
  }
}

const addProductC = async (req, res, next) => {
  const connection = await connectDb()

  try {
    const { store_id, name, type, price, stock, unit } = req.body
    const ingredient = []
    
    
    if (type === 'produk_olahan') {
      if (req.body.hasOwnProperty('ingredient')) {
        ingredient.push(req.body.ingredient)
      } else {
        return res.status(400).json({
          'is_error': true,
          'msg': "Pilih Min. 1 Bahan Baku Produk Olahan",
        })
      }
    }

    const result = await addProductRepo(connection, store_id, name, type, price, stock, unit, ingredient)
    return res.status(200).json({
      'is_error': false,
      'inserted_id': result
    })
  } catch (error) {
    await connection.rollback()
    next(error)
  } finally {
    connection.end()
    
  }
}

module.exports = { getAllSupplierC, getDetailSupplierC, addProductC }