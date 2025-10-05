const getStoreDetailRepo = async (connection, store_id) => {
  try {

    const arrSqlStore = [
      `SELECT s.name, s.address, s.phone, s.percentage_max_emoji_disc, s.created_at, u.name owner_name`,
      `FROM stores AS s`,
      `INNER JOIN users AS u`,
      `ON s.id = u.store_id`,
      "WHERE s.id = ?",
      "AND u.user_role = 'owner'",
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
      `UPDATE stores`,
      `SET name = ?, address = ?, phone = ?, percentage_max_emoji_disc = ?, updated_at = ?`,
      `WHERE id = ?`
    ]
    const sqlStatement = arrSql.join(" ")

    const [result] = await connection.execute(sqlStatement, [
      name,
      address,
      phone,
      percentage_max_emoji_disc,
      updated_at,
      store_id
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