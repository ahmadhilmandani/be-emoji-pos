const connectDb = require("../config/db")
const { addProductRepo, allProdutcs, getProductDetailRepo, updateProductRepo } = require("../repositories/productRepo")
const { addSupplierRepo, detailSupplierRepo } = require("../repositories/supplierRepo")

const getProducts = async (req, res, next) => {
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

    const result = await allProdutcs(connection, limit, offset, storeId, type)

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

const getProductDetail = async (req, res, next) => {
  const pool = await connectDb()
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    let { product_id } = req.params

    const result = await getProductDetailRepo(connection, product_id)

    return res.status(200).json({
      'is_error': false,
      'product': result
    })

  } catch (error) {
    await connection.rollback()
    next(error)
  } finally {
    await connection.release()
  }
}

const updateProductC = async (req, res, next) => {
  const pool = await connectDb()
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    let { product_id } = req.params
    const { name, type, price, unit } = req.body
    const phys_prod_min_stock = req.body.phys_prod_min_stock || null
    const ingredient = req.body.ingredient || null

    const result = await updateProductRepo(connection, product_id, name, type, phys_prod_min_stock, price, unit, ingredient || [])

    return res.status(200).json({
      'is_error': false,
      'msg': "Berhasil"
    })

  } catch (error) {
    await connection.rollback()
    next(error)
  } finally {
    await connection.release()
  }
}


const addProductC = async (req, res, next) => {
  const pool = await connectDb()
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    const storeId = req.user.store_id
    const { name, type, price, unit } = req.body
    const phys_prod_min_stock = req.body?.phys_prod_min_stock || null
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

    const result = await addProductRepo(connection, storeId, name, type, phys_prod_min_stock, price, unit, ingredient)
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

module.exports = { getProducts, addProductC, getProductDetail, updateProductC }