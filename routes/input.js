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
  return utils.query(`
  SELECT QUE_CODE, QUE_NAME, QUE_TEXT, CAT_NAME, INS_QUE.CAT_CODE
    FROM INS_QUE 
    JOIN INS_CAT ON INS_QUE.CAT_CODE=INS_CAT.CAT_CODE;`, 
  connection)
    .then(({ results, fields }) => {
      connection.end();
      let categories = {};
      for(let row of results){
        categories[row.CAT_CODE] = categories[row.CAT_CODE] || {name:row.CAT_NAME, questions:[]}
        categories[row.CAT_CODE].questions.push({code:row.QUE_CODE,name:row.QUE_NAME,text:row.QUE_TEXT})
      }
      return res.render('input', {
        data: {
          questions: categories,
          answers: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
          topAnswers: ["Very Bad", "Bad", "Neutral", "Good", "Very Good"]
        }
      });
    })
    .catch((e) => {
      return res.render('error', { error: e });
      console.error(e);
    });
});

module.exports = router;