const express = require('express');
const router = express.Router();
const utils = require('../utils');
const mysql = require('mysql');

/* GET users listing. */
router.get('/', function (req, res, next) {
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'scott',
    password: 'tiger',
    database: 'gisq'
  });

  connection.connect();

  return utils.query('SELECT name, region, population FROM bbc', connection)
    .then(({results,fields})=>{
      connection.end();
      return res.render('sql', { data: results });
    })
    .catch((e)=>{
      return res.render('error', { error:e });
      console.error(e);
    });
});

module.exports = router;