const express = require('express');
const router = express.Router();
const utils = require('../utils');
const mysql = require('mysql');

/* GET home page. */
router.get('/output.html', (req, res, next) => {
  return res.render('output', {
    data: {
      msg: "test"
    }
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
  let q = '%'+req.query.q.toUpperCase()+'%';

  return utils.query({sql:query, params: [q,q]},connection)
    .then(({results})=>{
      connection.end();
      return res.status(200).send(results.sort((a, b) => { 
        // sort strings by distance to the query
        return 
        (utils.jaroWinkler(req.query.q,b.MOD_CODE)+utils.jaroWinkler(req.query.q,b.MOD_NAME)) - 
        (utils.jaroWinkler(req.query.q,a.MOD_CODE)+utils.jaroWinkler(req.query.q,a.MOD_NAME)) 
      }))
    })
    .catch(e=>{
      console.error(e);
      connection.end();
      return res.status(400).send({ error: 'Query failed' })
    });
  
});

module.exports = router;

function validateModCode(str) {
  const rgx = /^[A-Z]{3}\d{5}$/
  return rgx.test(str.toUpperCase());
}