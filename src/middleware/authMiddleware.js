const jwt = require('jsonwebtoken');

const checkToken = async (req, res, next) => {
  try {
    const token = req.headers['authorization']
    if (!token) {
      return res.status(401).send({
        'is_error': true,
        'msg': "Silahkan Login Terlebih Dahulu!",
      })
    }
    const decodeToken = jwt.verify(token.replace('Bearer ', ''), "PASSWORD")
    req.user = decodeToken.user
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = { checkToken }