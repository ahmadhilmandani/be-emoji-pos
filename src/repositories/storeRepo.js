const ShortUniqueId = require("short-unique-id")

const getStoreDetailRepo = async (connection, store_id) => {
  try {

    const arrSqlStore = [
      `SELECT name, address, phone, percentage_max_emoji_disc`,
      `FROM store`,
      "WHERE id = ?"
    ]
    const sqlStatementStore = arrSqlStore.join(" ")

    const [storeRes] = await connection.execute(sqlStatementStore, [store_id])
    if (storeRes.length === 0) {
      throw new Error("Store not found")
    }
    return storeRes

  } catch (error) {
    throw error
  }
}

const updateStoreRepo = async (connection, store_id, name, address, phone, percentage_max_emoji_disc, updated_at) => {
  try {
    const arrSql = [
      `UPDATE store`,
      `SET name = ?, address = ?, phone = ?, percentage_max_emoji_disc = ?, updated_at = ?`,
      `WHERE id = ?`
    ]
    const sqlStatement = arrSql.join(" ")

    const [result] = await connection.execute(sqlStatement, [
      name,
      address,
      phone,
      percentage_max_emoji_disc,
      store_id,
      updated_at
    ])

    if (result.affectedRows === 0) {
      throw new Error("Store not found or no changes applied")
    }

    return { message: "Store updated successfully" }
  } catch (error) {
    throw error
  }
}


module.exports = { getStoreDetailRepo, updateStoreRepo }