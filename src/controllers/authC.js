const connectDb = require("../config/db")
const { registerStoreRepo, addCashierRepo, loginRepo } = require("../repositories/authRepo")
const jwt = require('jsonwebtoken')


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

const loginC = async (req, res, next) => {
  const connection = await connectDb()

  try {
    await connection.beginTransaction()

    const { email, password } = req.body

    const getUser = await loginRepo(connection, email, password)

    if (getUser.length == 0) {
      return res.status(404).send({
        'is_error': true,
        'msg': 'Email atau Password Salah'
      })
    }

    const result = {
      user_id: getUser[0].id,
      name: getUser[0].name,
      email: getUser[0].email,
      role: getUser[0].user_role
    }

    const token = jwt.sign({ user: result }, "PASSWORD", { expiresIn: 86400 })

    if (getUser) {
      result['token'] = token
      req.result = result
      return res.status(201).send({ 'user': result })
    }


    return res.status(201).send()

  } catch (error) {
    await connection.rollback()
    next(error)
  } finally {
    connection.release()
  }
}

module.exports = { registerStoreC, addCashierC, loginC }