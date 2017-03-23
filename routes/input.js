const express = require('express');
const router = express.Router();
const utils = require('../utils');
const mysql = require('mysql');

/* GET question listing. */
router.get('/', function (req, res, next) {
  let connection = mysql.createConnection({
    host: 'localhost',
    user: '40211946',
    password: 'dT1xT4mu',
    database: '40211946'
  });

  connection.connect();
  // Query to get all the questions
  // SELECT QUE_CODE, QUE_NAME, QUE_TEXT, CAT_NAME from INS_QUE JOIN INS_CAT ON INS_QUE.CAT_CODE=INS_CAT.CAT_CODE;
  return utils.query(`
  SELECT QUE_CODE, QUE_NAME, QUE_TEXT, CAT_NAME
    FROM INS_QUE 
    JOIN INS_CAT ON INS_QUE.CAT_CODE=INS_CAT.CAT_CODE;`, 
  connection)
    .then(({ results, fields }) => {
      console.log(results);
      connection.end();
      return res.render('input', {
        data: {
          questions: results
        }
      });
    })
    .catch((e) => {
      return res.render('error', { error: e });
      console.error(e);
    });
});

module.exports = router;