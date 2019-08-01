const express = require('express');
const router = express.Router();

router.use('/security', require('./security'));
router.use('/user', require('./user'));

module.exports = router;
