var userCollection = require('../collection/users');

var appRouter = function(app, db) {
	app.post("/services/login", function(req, res) {
        // console.log(req);
        var username = req.query._username;
        var userpassword = req.query._userpassword;

        console.log('Requerimiento: ' + JSON.stringify({ user: username, pass: userpassword}));

        var dataPromise = userCollection(db, username, userpassword);
        dataPromise.then(function (user) {
            // console.log(user);
            // console.log(user.name);
            if (user != null) {
                if (user.name === username && user.pass === userpassword) {
                    const crypto = require('crypto')
                    const token = crypto.randomBytes(24).toString('hex');
                    console.log('Usuario identificado correctamente');
                    return {
                        valid: true,
                        message: 'Bienvanido ' + user.name,
                        token: token
                    }
                } else {
                    console.log('Usuario o contraseña incorrecta, Usuario: ' + username);
                    return  {
                        valid: false,
                        message: 'Usuario o contraseña incorrecta'
                    }
                }

            } else {
                console.log('user access error, user: ' + username);
                return {
                    valid: false,
                    message: 'Usuario o contraseña incorrecta'
                }
            }

        }).then(function (data) {
            console.log(data);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(data));
        });

    });
};


module.exports = appRouter;