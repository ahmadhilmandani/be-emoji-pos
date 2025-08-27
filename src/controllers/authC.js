const connectDb = require("../config/db")
const { registerStoreRepo, addCashierRepo } = require("../repositories/authRepo")

const registerStoreC = async (req, res, next) => {
  const connection = await connectDb()
  try {
    const { email, name, password, store_name, store_address, store_phone } = req.body

    const result = await registerStoreRepo(email, name, password, store_name, store_address, store_phone)

    await connection.commit()

    return res.status(201).send({ 'data': result })
  } catch (error) {
    await connection.rollback()
    next(error)
  }
}


const addCashierC = async (req, res, next) => {
  const connection = await connectDb()
  try {
    const { email, name, password, store_id } = req.body

    const result = await addCashierRepo(email, name, password, store_id)

    await connection.commit()

    return res.status(201).send({ 'data': { 'inserted_id': result } })
  } catch (error) {
    await connection.rollback()
    next(error)
  }
}

module.exports = { registerStoreC, addCashierC }