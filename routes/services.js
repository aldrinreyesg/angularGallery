var path = require('path');
var flash = require('express-flash');

var appRouter = function(app, db) {
	app.get("/services/login", function(req, res) {
        var username = req.query._username;
        var userpassword = req.query._userpassword;
        var jsRes = {};

        res.setHeader('Content-Type', 'application/json');

        if (username != null && userpassword != null)
        {
            // var token = null;
            var document = db.collection("users").findOne({name: username, pass: userpassword}, function (err, result) {
                var jsRes = {};
                if (err) throw err;
                // console.log(result);

                if(result != null){
                    if(result.name === username && result.pass === userpassword) {
                        const crypto = require('crypto')
                        const token = crypto.randomBytes(24).toString('hex');
                        console.log('user access correct');
                        jsRes = {
                            valid: true,
                            message: 'Bienvanido ' + result.name,
                            token: token }
                    }else{
                        console.log('user access error, user: '+ username);
                        jsRes = {
                            valid: false,
                            message: 'Usuario o contraseña incorrecta'
                        }
                    }

                }else {
                    console.log('user access error, user: '+ username);
                    jsRes = {
                        valid: false,
                        message: 'Usuario o contraseña incorrecta'
                    }
                }
                // callback(result.toArray());
                // console.log("asdads" + JSON.stringify(jsRes));
                // result.jsRes = jsRes;
                // return result;
                db.close();
                req.session.data = jsRes;
            });
            jsRes = req.session.data;
        }else{
            jsRes = { valid: false, message: 'Usuario o contraseña incorrecta' };
            console.log("blank user and pass");
        }
        res.send(JSON.stringify(jsRes));
    });
};


module.exports = appRouter;