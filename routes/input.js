const express = require('express');
const router = express.Router();
const utils = require('../utils');
const mysql = require('mysql');

/* GET question listing. */
router.get('/', function (req, res, next) {
  if (!req.query.u || !validateMatric(req.query.u)) return res.status(400).render('identification');
  let connection = mysql.createConnection({
    host: 'localhost',
    user: '40211946',
    password: 'dT1xT4mu',
    database: '40211946'
  });

  connection.connect();
  // Query to get all the questions
  let qQuery = `
  SELECT QUE_CODE, QUE_NAME, QUE_TEXT, CAT_NAME, INS_QUE.CAT_CODE
    FROM INS_QUE 
    JOIN INS_CAT ON INS_QUE.CAT_CODE=INS_CAT.CAT_CODE;
    `;
  let mQuery = `
    SELECT
  -- CAM_SMO Fields
  CAM_SMO.SPR_CODE,
  CAM_SMO.MOD_CODE, 
  CAM_SMO.AYR_CODE, 
  CAM_SMO.PSL_CODE,
  -- INS_MOD Fields 
  INS_MOD.MOD_NAME, 
  INS_MOD.PRS_CODE,
  -- INS_PRS Fields
  INS_PRS.PRS_FNM1, 
  INS_PRS.PRS_SURN,
  -- INS_SPR Fields
  INS_SPR.SPR_FNM1,
  INS_SPR.SPR_SURN
FROM 
  CAM_SMO 
  JOIN INS_MOD ON CAM_SMO.MOD_CODE = INS_MOD.MOD_CODE
  JOIN INS_SPR ON CAM_SMO.SPR_CODE = INS_SPR.SPR_CODE
  JOIN INS_PRS ON INS_MOD.PRS_CODE = INS_PRS.PRS_CODE
WHERE CAM_SMO.SPR_CODE = '${req.query.u}';
  `;

  let cats = utils.query({ sql: qQuery }, connection)
    .then(({ results, fields }) => {
      let categories = {};
      for (let row of results) {
        categories[row.CAT_CODE] = categories[row.CAT_CODE] || { name: row.CAT_NAME, questions: [] }
        categories[row.CAT_CODE].questions.push({ code: row.QUE_CODE, name: row.QUE_NAME, text: row.QUE_TEXT })
      }
      return categories;
    }).catch((e) => {
      return res.render('error', { error: e });
      console.error(e);
    });

    let mods = utils.query({ sql: mQuery }, connection)
    .then(({ results, fields }) => {
      return results;
    }).catch((e) => {
      return res.render('error', { error: e });
      console.error(e);
    });

  return Promise.all([mods, cats])
    .then(([mod, cat]) => {
      connection.end();
      return res.render('input', {
        data: {
          questions: cat,
          modules: mod,
          answers: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
          topAnswers: ["Very Bad", "Bad", "Neutral", "Good", "Very Good"],
          user: {
            name: "Antero Duarte"
          }
        }
      });
    });
});

router.post('/save', (req, res, next) => {
  let connection = mysql.createConnection({
    host: 'localhost',
    user: '40211946',
    password: 'dT1xT4mu',
    database: '40211946'
  });
  let query = `
  INSERT INTO INS_RES 
    (SPR_CODE,MOD_CODE,AYR_CODE,PSL_CODE,QUE_CODE,RES_VALU) 
    VALUES ?
    ON DUPLICATE KEY 
    UPDATE 
      SPR_CODE = VALUES(SPR_CODE), 
      MOD_CODE = VALUES(MOD_CODE), 
      AYR_CODE = VALUES(AYR_CODE), 
      PSL_CODE = VALUES(PSL_CODE), 
      QUE_CODE = VALUES(QUE_CODE), 
      RES_VALU = VALUES(RES_VALU);`
  let answer = Object.keys(req.body.answers).map(i => ['50200036', 'INF08104', '2016/7', 'TR1', i, req.body[i]]);
  // console.log(answer);

  // query = mysql.format(query, answer);
  // console.log(query);
  return utils.query({ sql: query, params: [answer] }, connection)
    .then(({ results }) => {
      connection.end();

      res.setHeader('Content-Type', 'application/json');
      return res.status(200).send({ message: 'OK' });

    })
    .catch((e) => {
      connection.end();
      console.error(e);
      return res.status(400).send({ error: e.message })
    });

});

module.exports = router;

function validateMatric(nr) {
  const rgx = /^\d{8}$/
  return rgx.test(nr);
}