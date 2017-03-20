module.exports = {
  query(sql, connection) {
    return new Promise((resolve, reject) => {
      connection.query(sql, (error, results, fields) => {
        if (error) reject(error);

        resolve({ results, fields });
      })
    })
  }
}