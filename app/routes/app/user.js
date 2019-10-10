const express = require('express');
const router = express.Router();
//const auth = require('../auth');
//const isset = require('isset');
const path = require('path');


router.get("/user", function(req, res) {
    res.render('pages/user/home', {
        root: path.join(__dirname, '../views/pages'),
        expressFlash: res.locals.sessionFlash,
    });
});
router.get("/user/galleries", function(req, res) {
    res.render('pages/user/galleries', {
        root: path.join(__dirname, '../views/pages'),
        expressFlash: res.locals.sessionFlash,
    });
});


module.exports = router;