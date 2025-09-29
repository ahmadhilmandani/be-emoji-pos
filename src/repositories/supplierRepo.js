const allSupplierRepo = async (connection, limit, offset, store_id) => {
  try {
    const sql_statement = `
      SELECT
        *
      FROM
        suppliers
      WHERE
        store_id =?
      LIMIT ?
      OFFSET ?
    `
    const [result] = await connection.execute(sql_statement, [store_id, limit.toString(), offset.toString()])
    return result
  } catch (error) {
    throw error
  }
}

const detailSupplierRepo = async (connection, id, store_id) => {
  try {
    const sql_statement = `
      SELECT
        *
      FROM
        suppliers
      WHERE
        id = ?
      AND
        store_id = ?
      LIMIT
        1
    `
    const [result] = await connection.execute(sql_statement, [id, store_id])
    return result
  } catch (error) {
    throw error
  }
}

const addSupplierRepo = async (connection, store_id, name, phone, address) => {
  try {
    const sql_statement = `
      INSERT INTO
        suppliers
        (
          store_id,
          name,
          phone,
          address
        )
      VALUES
        (
          ?,
          ?,
          ?,
          ?
        )
    `
    const [result] = await connection.execute(sql_statement, [store_id, name, phone, address])
    return result.insertId
  } catch (error) {
    throw error
  }
}

const updateSupplierRepo = async (connection, supplier_id, store_id, name, phone, address) => {
  try {
    const sql_statement = `
      UPDATE
        suppliers
      SET
        store_id = ?,
        name = ?,
        phone = ?,
        address = ?
      WHERE
        id = ?
    `

    const [result] = await connection.execute(sql_statement, [
      store_id,
      name,
      phone,
      address,
      supplier_id
    ])

    return result.affectedRows
  } catch (error) {
    throw error
  }
}


module.exports = { allSupplierRepo, detailSupplierRepo, addSupplierRepo, updateSupplierRepo }