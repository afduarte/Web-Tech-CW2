const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/output.html', (req, res, next) => {
  return res.send("It works for a dot in the route name "+Math.random().toFixed(5));
});

module.exports = router;
