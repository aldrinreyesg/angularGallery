var path = require('path');
var flash = require('express-flash');

var appRouter = function(app) {
    app.use(flash());
    app.use(function(req, res, next){
        res.locals.sessionFlash = req.session.sessionFlash;
        delete req.session.sessionFlash;
        next();
    });
    app.all("/error", function(req, res) {
        req.flash('flashmessage', 'Paguina no encontrada');
        res.redirect('/');
    });

	app.get("/", function(req, res) {
        // req.flash('flashError', '4343343243423443');

        res.render('pages/default', {
            root: path.join(__dirname, '../views/pages'),
            expressFlash: res.locals.sessionFlash,
        });
    });

    app.get("/login", function(req, res) {
        res.render('pages/login', { root: path.join(__dirname, '../views/pages') });
    });

};


module.exports = appRouter;