const allSupplierRepo = async (connection, limit, offset) => {
  try {
    const sql_statement = `
      SELECT
        *
      FROM
        suppliers
      LIMIT ?
      OFFSET ?
    `
    const [result] = await connection.execute(sql_statement, [limit.toString(), offset.toString()])
    return result
  } catch (error) {
    throw error
  }
}

const detailSupplierRepo = async (connection, id) => {
  try {
    const sql_statement = `
      SELECT
        *
      FROM
        supplier
      WHERE
        id = ?
      LIMIT
        1
    `
    const [result] = await connection.execute(sql_statement, [id])
    return result
  } catch (error) {
    throw error
  }
}

const addSupplierRepo = async (connection, name, phone, address) => {
  try {
    const sql_statement = `
      INSERT INTO
        suppliers
        (
          name,
          phone,
          address
        )
      VALUES
        (
          ?,
          ?,
          ?
        )
    `
    const [result] = await connection.execute(sql_statement, [name, phone, address])
    return result.insertId
  } catch (error) {
    throw error
  }
}

module.exports = { allSupplierRepo, detailSupplierRepo, addSupplierRepo }