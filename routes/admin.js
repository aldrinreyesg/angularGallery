var path = require('path');
var flash = require('express-flash');

var appRouter = function(app) {

    app.get("/admin", function(req, res) {
        res.render('pages/admin/home', {
            root: path.join(__dirname, '../views/pages'),
            expressFlash: res.locals.sessionFlash,
        });
    });
    app.get("/admin/users", function(req, res) {
        res.render('pages/admin/users', {
            root: path.join(__dirname, '../views/pages'),
            expressFlash: res.locals.sessionFlash,
        });
    });
};

module.exports = appRouter;