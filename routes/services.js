var userCollection = require('../collection/users');
var galleryCollection = require('../collection/gallery');
var imagesCollection = require('../collection/images');

var appRouter = function(app, db) {
    app.post("/services/login", function (req, res) {
        // console.log(req);
        var username = req.query._username;
        var userpassword = req.query._userpassword;

        console.log('Requerimiento: ' + JSON.stringify({user: username, pass: userpassword}));

        var dataPromise = userCollection.getUserLogin(db, username, userpassword);
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
                    return {
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
            // console.log(data);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(data));
        });

    });

    app.get("/services/usersTable", function (req, res) {
        var token = req.query.token;

        var dataPromise = userCollection.getUsers(db);
        dataPromise
            .then(function (rows) {
                if (token != null) {
                    return {
                        valid: true,
                        message: '200',
                        total: 1,
                        rows
                    }
                } else {
                    return {
                        valid: false,
                        message: 'Token Inválido.'
                    }
                }
            })
            .then(function (data) {
                // console.log(data);
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(data));
            });
    });

    app.get("/services/galleries", function (req, res) {
        var token = req.query.token;
        var user = req.query.user;

        var dataPromise = galleryCollection.getUserGalleries(db, user);
        dataPromise
            .then(function (rows) {
                if (token != null) {
                    return {
                        valid: true,
                        message: '200',
                        total: 1,
                        rows
                    }
                } else {
                    return {
                        valid: false,
                        message: 'Token Inválido.'
                    }
                }
            })
            .then(function (data) {
                // console.log(data);
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(data));
            });
    });

    app.get("/services/images", function (req, res) {
        var token = req.query.token;
        var user = req.query.user;
        var dataPromise = null;

        if(user != null) {
            dataPromise = imagesCollection.getUserImages(db, user);
        }else{
            dataPromise = imagesCollection.getImages(db);
        }
        dataPromise
            .then(function (rows) {
                if (token != null) {
                    return {
                        valid: true,
                        message: '200',
                        total: rows.length,
                        rows
                    }
                } else {
                    return {
                        valid: false,
                        message: 'Token Inválido.'
                    }
                }
            })
            .then(function (data) {
                // console.log(data);
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(data));
            });
    });

    app.get("/services/imageUpload", function (req, res) {
        var token = req.query.token;
        var row = JSON.parse(req.query.row);
        var isJSON = require('is-valid-json');
        var path = require('path');
        var moment = require('moment');

        if( isJSON( row ) ) {

            var imageRow = {
                id: 5,
                name: row.name,
                descript: row.desc,
                filename: row.image.split('\\').pop(),
                type: path.extname(row.image),
                public: row.public,
                galleryid: 1,
                created: moment().format("YYYY-MM-DD hh:mm:ss"),
                url: "http://localhost:3000/gallery/image/" + row.image.split('\\').pop()
            }

            var dataPromise = imagesCollection.setImage(db, imageRow);
            dataPromise
                .then(function (rows) {
                    if (token != null) {
                        return {
                            valid: true,
                            message: 'Imágen agregada'
                        }
                    } else {
                        return {
                            valid: false,
                            message: 'Token Inválido.'
                        }
                    }
                })
                .then(function (data) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(data));
                });
        }else{
            var data = {
                valid: false,
                message: 'Estructura enviada no es válida.'
            }
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(data));
        }
    });

    app.get("/services/imageDelete", function (req, res) {
        var token = req.query.token;
        var row = JSON.parse(req.query.row);
        // console.log(row);
        var isJSON = require('is-valid-json');

        if( isJSON( row ) ) {
            var dataPromise = imagesCollection.delImage(db, row);
            dataPromise
                .then(function (rows) {
                    if (token != null) {
                        return {
                            valid: true,
                            message: 'Imágen eliminada'
                        }
                    } else {
                        return {
                            valid: false,
                            message: 'Token Inválido.'
                        }
                    }
                })
                .then(function (data) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(data));
                });

        }else{
            var data = {
                valid: false,
                message: 'Estructura enviada no es válida.'
            }
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(data));
        }
    });
}
module.exports = appRouter;