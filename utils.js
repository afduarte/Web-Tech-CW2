module.exports = {
  query({ sql, params }, connection) {
    return new Promise((resolve, reject) => {
      if (params) {
        connection.query(sql, params, (error, results, fields) => {
          if (error) reject(error);

          resolve({ results, fields });
        })
      } else {
        connection.query(sql, (error, results, fields) => {
          if (error) reject(error);

          resolve({ results, fields });
        });
      }
    })
  }
}