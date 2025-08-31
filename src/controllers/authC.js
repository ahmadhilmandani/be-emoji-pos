const connectDb = require("../config/db")
const { registerStoreRepo, addCashierRepo } = require("../repositories/authRepo")

const registerStoreC = async (req, res, next) => {
  const connection = await connectDb()

  try {
    await connection.beginTransaction()
    
    const { email, name, password, store_name, store_address, store_phone } = req.body
    const age = req.body?.age
    const sex = req.body?.sex
    const phone = req.body?.phone

    const result = await registerStoreRepo(connection, email, name, password, age, sex, phone, store_name, store_address, store_phone)

    await connection.commit()

    return res.status(201).send({ 'data': result })
  } catch (error) {
    await connection.rollback()
    next(error)
  } finally {
    connection.release()
  }
}


const addCashierC = async (req, res, next) => {
  const connection = await connectDb()

  try {
    await connection.beginTransaction()

    const { email, name, password, store_id } = req.body

    const result = await addCashierRepo(connection, email, name, password, store_id)

    await connection.commit()

    return res.status(201).send({ 'data': { 'inserted_id': result } })
    
  } catch (error) {
    await connection.rollback()
    next(error)
  } finally {
    connection.release()
  }
}

module.exports = { registerStoreC, addCashierC }