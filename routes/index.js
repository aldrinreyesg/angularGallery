const express = require('express');
const router = express.Router();

router.use('/api', require('./api'));

router.use('/', require('./app/pages'));

router.use('/user', require('./app/user'));

router.use('/admin', require('./app/admin'));


module.exports = router;
