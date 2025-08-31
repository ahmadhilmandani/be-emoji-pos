const errorHanlder = (err, req, res, next) => {
  const errStatus = err.status || 500

  return res.status(errStatus).json(
    {
      'is_error': true,
      'name': err.name,
      'stack': err.stack,
      'msg': err.message,
    }
  )
}

module.exports = { errorHanlder }