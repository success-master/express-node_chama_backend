var express = require('express');
var router = express.Router();
var _transaction = require('./ctl_transactions.js');

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Transaction Time: ', Date.now());
  next();
});

router.post('/approvePendingTransaction', _transaction.approvePendingTransaction);
router.post('/updateMerryGoRound', _transaction.updateMerryGoRound);

module.exports = router;