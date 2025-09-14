const connectDb = require("../config/db")
const { addProductRepo, allProdutcs } = require("../repositories/productRepo")
const { addSupplierRepo, detailSupplierRepo } = require("../repositories/supplierRepo")

const getProducts = async (req, res, next) => {
  const pool = await connectDb()
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    let { page, limit } = req.query
    page = parseInt(page) || 1
    limit = parseInt(limit) || 10
    const offset = (page - 1) * limit
    const type = req.query?.type || null

    const result = await allProdutcs(connection, limit, offset, type)

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

// const getDetailSupplierC = async (req, res, next) => {
//   const pool = await connectDb()
//   const connection = await pool.getConnection()

//   try {
//     const { id } = req.params
//     const result = await detailSupplierRepo(connection, id)

//     return res.status(200).json({
//       'is_error': false,
//       'supplier': result
//     });

//   } catch (error) {
//     await connection.rollback()
//     next(error)
//   } finally {
//     await connection.release()
//   }
// }

const addProductC = async (req, res, next) => {
  const pool = await connectDb()
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    const { store_id, name, type, price, unit } = req.body
    let ingredient = null


    if (type === 'produk_olahan') {
      if (req.body.hasOwnProperty('ingredient')) {
        ingredient = req.body.ingredient
      } else {
        return res.status(400).json({
          'is_error': true,
          'msg': "Pilih Min. 1 Bahan Baku Produk Olahan",
        })
      }
    }

    const result = await addProductRepo(connection, store_id, name, type, price, unit, ingredient)
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

module.exports = { getProducts, addProductC }