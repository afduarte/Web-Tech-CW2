const express = require('express');
const router = express.Router();
const utils = require('../utils');
const mysql = require('mysql');

/* GET home page. */
router.get('/output.html', (req, res, next) => {
  let connection = mysql.createConnection({
    host: 'localhost',
    user: '40211946',
    password: 'dT1xT4mu',
    database: '40211946'
  });
  let sql = `
    SELECT QUE_CODE, QUE_NAME
    FROM INS_QUE;
    `;
  return utils.query({ sql }, connection)
    .then(({ results, fields }) => {
      connection.end();
      let categories = {};
      for (let row of results) {
        categories[row.CAT_CODE] = categories[row.CAT_CODE] || { name: row.CAT_NAME, questions: [] }
        categories[row.CAT_CODE].questions.push({ code: row.QUE_CODE, name: row.QUE_NAME, text: row.QUE_TEXT })
      }
      return res.render('output', {
        data: {
          categories: results,
          mod1: req.query.mod1,
          mod2: req.query.mod2
        }
      });
    });
});

router.get('/autocomplete', (req, res, next) => {
  if (!req.query.q) return res.status(400).send({ error: 'Invalid Module Number' });
  let connection = mysql.createConnection({
    host: 'localhost',
    user: '40211946',
    password: 'dT1xT4mu',
    database: '40211946'
  });
  let query = `SELECT MOD_CODE, MOD_NAME FROM INS_MOD WHERE MOD_CODE LIKE ? OR MOD_NAME LIKE ?;`;
  let q = '%' + req.query.q.toUpperCase() + '%';

  return utils.query({ sql: query, params: [q, q] }, connection)
    .then(({ results }) => {
      connection.end();
      return res.status(200).send(results.sort((a, b) => {
        // sort strings by distance to the query
        return
        (utils.jaroWinkler(req.query.q, b.MOD_CODE) + utils.jaroWinkler(req.query.q, b.MOD_NAME)) -
          (utils.jaroWinkler(req.query.q, a.MOD_CODE) + utils.jaroWinkler(req.query.q, a.MOD_NAME))
      }))
    })
    .catch(e => {
      console.error(e);
      connection.end();
      return res.status(400).send({ error: 'Query failed' })
    });

});

router.get('/module', (req, res, next) => {
  const modules = [req.query.mod1, req.query.mod2].filter(validateModCode);
  if(!modules.length) return res.status(400).send({error:"Module validation failed"});

  let connection = mysql.createConnection({
    host: 'localhost',
    user: '40211946',
    password: 'dT1xT4mu',
    database: '40211946'
  });
  let query = `
  SELECT QUE_CODE, MOD_CODE, AVG(RES_VALU) AS VAL
  FROM INS_RES 
  WHERE MOD_CODE IN (?) 
  GROUP BY QUE_CODE, MOD_CODE;
  `
  return utils.query({ sql: query, params: [modules] }, connection)
    .then(({ results, fields }) => {
      connection.end();
      let modules = {};
      results.forEach(i => {
        modules[i.MOD_CODE] = modules[i.MOD_CODE] || [];
        modules[i.MOD_CODE].push({ value: i.VAL, q: i.QUE_CODE })
      });
      return res.status(200).send(modules);
    }).catch(e => {
      console.error(e);
      connection.end();
      return res.send({ error: "Query Failed" });
    })
});
router.get('/category', (req, res, next) => {
  const modules = [req.query.mod1, req.query.mod2].filter(validateModCode);
  if(!modules.length) return res.status(400).send({error:"Module validation failed"});
  let connection = mysql.createConnection({
    host: 'localhost',
    user: '40211946',
    password: 'dT1xT4mu',
    database: '40211946'
  });
  let query = `
  SELECT INS_CAT.CAT_CODE, INS_CAT.CAT_NAME, MOD_CODE, AVG(RES_VALU) AS VAL 
  FROM INS_RES 
  JOIN INS_QUE ON INS_RES.QUE_CODE=INS_QUE.QUE_CODE 
  JOIN INS_CAT ON INS_QUE.CAT_CODE=INS_CAT.CAT_CODE
  WHERE MOD_CODE IN (?)
  GROUP BY CAT_CODE, CAT_NAME, MOD_CODE;
  `
  return utils.query({ sql: query, params: [modules] }, connection)
    .then(({ results, fields }) => {
      connection.end();
      let modules = {};
      results.forEach(i => {
        modules[i.MOD_CODE] = modules[i.MOD_CODE] || [];
        modules[i.MOD_CODE].push({ value: i.VAL, c: i.CAT_CODE, cName:i.CAT_NAME })
      });
      return res.status(200).send(modules);
    }).catch(e => {
      console.error(e);
      connection.end();
      return res.send({ error: "Query Failed" });
    })
});

router.get('/percent', (req, res, next) => {
  if(!validateModCode(req.query.mod)) return res.status(400).send({error:`Module validation failed: ${req.query.mod}`});
  let connection = mysql.createConnection({
    host: 'localhost',
    user: '40211946',
    password: 'dT1xT4mu',
    database: '40211946'
  });
  let query = `
  SELECT INS_MOD.MOD_CODE, MOD_NAME, 100*AVG(CASE WHEN  RES_VALU >= 4 THEN 1 ELSE 0 END) AS VALUE
  FROM INS_RES 
  JOIN INS_MOD ON INS_MOD.MOD_CODE=INS_RES.MOD_CODE
  WHERE INS_RES.MOD_CODE='${req.query.mod}'
  GROUP BY MOD_CODE, MOD_NAME;
  `
  return utils.query({ sql: query }, connection)
    .then(({ results, fields }) => {
      connection.end();
      if(!results || !results.length) return res.status(400).send({error:`Module validation failed: ${req.query.mod}`});
      let over4 = parseFloat(results[0].VALUE);
      return res.status(200).send({
        mod:results[0].MOD_CODE,
        over:over4,
        under: 100-over4,
        modName: results[0].MOD_NAME
      });
    }).catch(e => {
      console.error(e);
      connection.end();
      return res.send({ error: "Query Failed" });
    })
});

module.exports = router;

function validateModCode(str) {
  const rgx = /^[A-Z]{3}\d{5}$/
  return str && rgx.test(str.toUpperCase());
}