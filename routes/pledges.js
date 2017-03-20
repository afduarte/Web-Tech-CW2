const express = require('express');
const router = express.Router();
const utils = require('../utils');
const mysql = require('mysql');

router.get('/', (req, res, next) => {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: '40211946',
    password: 'dT1xT4mu',
    database: '40211946'
  });


  connection.connect();

  return utils.query('SELECT name, amount FROM pledges', connection)
    .then(({ results, fields }) => {
      connection.end();
      res.format({
        html: () => {
          res.setHeader('Content-Type', 'text/html');
          return res.render('pledges', { data: results });
        },
        json: () => {
          res.setHeader('Content-Type', 'application/json');
          console.log('sending JSON')
          return res.status(200).send(results);
        }
      })
    })
    .catch((e) => {
      connection.end();
      console.error(e);
    });
});

router.post('/', (req, res, next) => {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: '40211946',
    password: 'dT1xT4mu',
    database: '40211946'
  });

  connection.connect();
  var sql = "INSERT INTO pledges SET ?";
  const pledge = {
    name: req.body.name,
    address: req.body.address,
    amount: parseFloat(req.body.amount)
  };
  if (!pledge.name || !pledge.address || !pledge.amount) {
    return res.status(400).send({ error: 'Invalid Pledge' })
  }
  sql = mysql.format(sql, pledge);
  return utils.query(sql, connection)
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