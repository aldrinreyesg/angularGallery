const router = require('express').Router();
const auth = require('auth');

router.get('/', auth.optional, (req, res, next) => {
    console.log("adsasda");
    if(isset(req.query.token)){
        var token = req.query.token;
        res.redirect('/admin');

    }else {
        return res.render('pages/default/home', {
            root: path.join(__dirname, '../views/pages'),
            expressFlash: res.locals.sessionFlash,
        });
    }
});
