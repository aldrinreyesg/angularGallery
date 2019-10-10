const express = require('express');
const router = express.Router();
const auth = require('../auth');
const isset = require('isset');
const path = require('path');

router.get('/', auth.optional, (req, res, next) => {
    if(isset(req.query.token)){
        // var token = req.query.token;
        res.redirect('/admin');

    }else {
        return res.render('pages/default/home', {
            root: path.join(__dirname, '../views/pages'),
            expressFlash: res.locals.sessionFlash,
        });
    }
});

router.get("/login", auth.optional, function(req, res) {
    res.render('pages/login', { root: path.join(__dirname, '../views/pages') });
});

router.get("/logout", function(req, res, next) {
    // TODO implementar logout
    if (req.session) {
        // delete session object
        req.session.destroy(function(err) {
            if(err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    }
    // res.redirect('/');
});

router.all("/error", function(req, res) {
    req.flash('flashmessage', 'Paguina no encontrada');
    res.redirect('/');
});

module.exports = router;