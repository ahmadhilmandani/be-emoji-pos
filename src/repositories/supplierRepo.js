const allSupplierRepo = async (connection, limit, offset) => {
  try {
    const sql_statement = `
      SELECT
        *
      FROM
        supplier
      LIMIT
        ?
      OFFSET
        ? 
    `
    const [result] = await connection.execute(sql_statement, [limit, offset])
    return result
  } catch (error) {
    throw new Error(error)
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
    throw new Error(error)
  }
}

const addSupplierRepo = async (connection, name, phone, address) => {
  try {
    const sql_statement = `
      INSERT INTO
        supplier
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
    return result.insertedId
  } catch (error) {
    throw new Error(error)
  }
}

module.exports = { allSupplierRepo, detailSupplierRepo, addSupplierRepo }