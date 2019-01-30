const express = require('express');
const router = express.Router();
const auth = require('../auth');
const isset = require('isset');
const path = require('path');

var flash = require('express-flash');

router.get("/", function(req, res) {
    res.render('pages/admin/home', {
        root: path.join(__dirname, '../views/pages'),
        expressFlash: res.locals.sessionFlash,
    });
});
router.get("/users", function(req, res) {
    res.render('pages/admin/users', {
        root: path.join(__dirname, '../views/pages'),
        expressFlash: res.locals.sessionFlash,
    });
});

module.exports = router;