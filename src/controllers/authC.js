const connectDb = require("../config/db")
const { loginRepo, addEmployeeRepo, addOwnerRepo, updateEmployeeRepo } = require("../repositories/authRepo")
const jwt = require('jsonwebtoken')


const addOwnerStoreC = async (req, res, next) => {
  const pool = await connectDb()
  const connection = await pool.getConnection()

  try {
    const { email, name, password, store_name, store_address, store_phone } = req.body
    const age = req.body?.age
    const sex = req.body?.sex
    const phone = req.body?.phone
    const percentage_max_emoji_disc = req.body.percentage_max_emoji_disc || 0

    const result = await addOwnerRepo(connection, email, name, password, age, sex, phone, store_name, store_address, percentage_max_emoji_disc, store_phone)

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

    const result = await addEmployeeRepo(connection, name, email, password, store_id, user_role)

    await connection.commit()

    return res.status(201).send({ 'data': { 'inserted_id': result } })

  } catch (error) {
    await connection.rollback()
    next(error)
  } finally {
    connection.end()
  }
}


const updateEmployeeC = async (req, res) => {
  const { id } = req.params
  const { user_id, role } = req.user
  const { name, email, password, userRole, age, sex, phone } = req.body

  try {
    if ((user_id !== id) && (role !== 'owner')) {
      throw new Error("Anda Tidak Memiliki Wewenang Untuk Ubah Data Karyawan")
    }
    const connection = await getConnection()
    const result = await updateEmployeeRepo(connection, id, name, email, password, userRole, age, sex, phone)
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


const softDeleEmployeeC = async (req, res) => {
  const { id } = req.params
  const { user_id, role } = req.user

  try {
    if ((user_id !== id) && (role !== 'owner')) {
      throw new Error("Anda Tidak Memiliki Wewenang Untuk Ubah Data Karyawan")
    }
    const connection = await getConnection()
    const result = await softDeleteEmployeeRepo(connection, id)
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
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
      store_id: getUser[0].store_id,
      store_name: getUser[0].store_name,
      percentage_max_emoji_disc: getUser[0].percentage_max_emoji_disc
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

module.exports = { addOwnerStoreC, addEmployeeC, loginC, updateEmployeeC, softDeleEmployeeC }