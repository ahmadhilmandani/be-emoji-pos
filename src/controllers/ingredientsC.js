const connectDb = require("../config/db")
const { allIngredientsRepo, addIngredientsRepo, updateIngredientStockRepo, updateIngredientRepo, getDetailIngredientsRepo } = require("../repositories/ingredientsRepo")


const getAllIngredients = async (req, res, next) => {
  const pool = await connectDb()
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    const { store_id } = req.user
    let { page, limit } = req.query
    page = parseInt(page) || 1
    limit = parseInt(limit) || 50
    const offset = (page - 1) * limit

    const result = await allIngredientsRepo(connection, store_id, limit, offset)

    return res.status(200).json({
      'is_error': false,
      'ingredients': result
    })

  } catch (error) {
    await connection.rollback()
    next(error)
  } finally {
    await connection.release()
  }
}

const getDetailIngredients = async (req, res, next) => {
  const pool = await connectDb()
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    const { store_id } = req.user
    let { id } = req.params

    const result = await getDetailIngredientsRepo(connection, store_id, id)

    return res.status(200).json({
      'is_error': false,
      'ingredients': result
    })

  } catch (error) {
    await connection.rollback()
    next(error)
  } finally {
    await connection.release()
  }
}

const addIngredients = async (req, res, next) => {
  const pool = await connectDb()
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    const { store_id } = req.user

    const { name, stock, min_stock, unit, price } = req.body

    const result = await addIngredientsRepo(connection, store_id, name, stock, min_stock, unit, price)

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

const purchaseIngredient = async (req, res, next) => {
  const pool = await connectDb()
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    const { ingredients } = req.body

    const result = await updateIngredientStockRepo(connection, ingredients)

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

const updateIngredient = async (req, res, next) => {
  const pool = await connectDb()
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    const { name, price, stock, min_stock, unit } = req.body

    const { id } = req.params
    const { store_id } = req.user

    await updateIngredientRepo(connection, name, price, stock, min_stock, unit, id, store_id)
    await connection.commit()

    return res.status(200).json({
      'is_error': false,
      'msg': 'berhasil'
    })
  } catch (error) {

  }
}

module.exports = { getAllIngredients, addIngredients, purchaseIngredient, updateIngredient, getDetailIngredients }