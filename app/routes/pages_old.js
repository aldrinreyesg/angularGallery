var path = require('path');
var flash = require('express-flash');
const isset = require('isset');

var appRouter = function(app) {
    //Normal User Route
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
	    if(isset(req.query.token)){
            // var token = req.query.token;
            res.redirect('/admin');

        }else {
            res.render('pages/default/home', {
                root: path.join(__dirname, '../views/pages'),
                expressFlash: res.locals.sessionFlash,
            });
        }
    });

    app.get("/login", function(req, res) {
        res.render('pages/login', { root: path.join(__dirname, '../views/pages') });
    });
    app.get("/logout", function(req, res, next) {
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


    //Auth User Route
    app.get("/user", function(req, res) {
        res.render('pages/user/home', {
            root: path.join(__dirname, '../views/pages'),
            expressFlash: res.locals.sessionFlash,
        });
    });
    app.get("/user/galleries", function(req, res) {
        res.render('pages/user/galleries', {
            root: path.join(__dirname, '../views/pages'),
            expressFlash: res.locals.sessionFlash,
        });
    });

};


module.exports = appRouter;