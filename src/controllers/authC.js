const connectDb = require("../config/db")

const registerC = async (req, res, next) => {
  const connection = await connectDb()
  try {
    const { email, name, password } = req.body
    const result = await registerRepo(email, name, password)
    await connection.commit()

    return res.status(201).send({ 'data': { 'inserted_id': result.insertId } })
  } catch (error) {
    await connection.rollback()
    next(error)
  }
}

module.exports = { registerC }