const connectDb = require("../config/db")
const { loginRepo, addEmployeeRepo, addOwnerRepo } = require("../repositories/authRepo")
const jwt = require('jsonwebtoken')


const addOwnerStoreC = async (req, res, next) => {
  const pool = await connectDb()
  const connection = await pool.getConnection()

  try {
    const { email, name, password, store_name, store_address, store_phone } = req.body
    const age = req.body?.age
    const sex = req.body?.sex
    const phone = req.body?.phone

    const result = await addOwnerRepo(connection, email, name, password, age, sex, phone, store_name, store_address, store_phone)

    await connection.commit()

    return res.status(201).send({ 'data': result })
  } catch (error) {
    await connection.rollback()
    next(error)
  } finally {
    await connection.release()
  }
}


const addEmployeeC = async (req, res, next) => {
  const pool = await connectDb()
  const connection = await pool.getConnection()

  try {
    const { email, name, password, store_id, user_role } = req.body

    const result = await addEmployeeRepo(connection, email, name, password, store_id, user_role)

    await connection.commit()

    return res.status(201).send({ 'data': { 'inserted_id': result } })

  } catch (error) {
    await connection.rollback()
    next(error)
  } finally {
    connection.end()
  }
}

const loginC = async (req, res, next) => {
  const pool = await connectDb()
  const connection = await pool.getConnection()

  try {
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
      role: getUser[0].user_role,
      store_id: getUser[0].store_id
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
    await connection.release()
  }
}

module.exports = { addOwnerStoreC, addEmployeeC, loginC }