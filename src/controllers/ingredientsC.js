const connectDb = require("../config/db")
const { allIngredientsRepo, addIngredientsRepo, updateIngredientStockRepo } = require("../repositories/ingredientsRepo")


const getAllIngredients = async (req, res, next) => {
  const pool = await connectDb()
  const connection = await pool.getConnection()

  try {
    const { store_id } = req.user
    let { page, limit } = req.query
    page = parseInt(page) || 1
    limit = parseInt(limit) || 10
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

const addIngredients = async (req, res, next) => {
  const pool = await connectDb()
  const connection = await pool.getConnection()

  try {
    const { store_id } = req.user

    const { name, stock, min_stock, unit } = req.body

    const result = await addIngredientsRepo(connection, store_id, name, stock, min_stock, unit)

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
    const { ingredients } = req.body

    const result = await updateIngredientStockRepo(connection, ingredients)

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

module.exports = { getAllIngredients, addIngredients, purchaseIngredient }