const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
const User = mongoose.model('Users');

//POST new user route (optional, everyone has access)
router.post('/create', auth.required, (req, res, next) => {
    const { body: { user } } = req;

    if(!user.email) {
        return res.status(422).json({
            message: {
                type: "error",
                text: "email is requiered",
            },
        });
    }

    if(!user.username) {
        return res.status(422).json({
            message: {
                type: "error",
                text: "username is requiered",
            },
        });
    }

    if(!user.password) {
        return res.status(422).json({
            message: {
                type: "error",
                text: "password is requiered",
            },
        });
    }

    const finalUser = new User(user);

    // finalUser.setPassword(user.password);
    finalUser.create(user.username, user.email, user.password, user.role, user.enabled);

    // return finalUser.save()
    //     .then(() => res.json({ user: finalUser.toAuthJSON() }));

    return finalUser.save()
        .then(() => User
        .find()
        .select('_id role username email created enabled')
        .exec(function (err, users) {
            if (err) return handleError(err);
            if (users){
                return res.status(200).json({
                    message: {
                        type: "info",
                        text: "lista de usuarios",
                    },
                    users
                });
            }
        }));
});

router.post('/remove', auth.required, (req, res, next) => {
    const {body: {user}} = req;

    if (!user.ids) {
        return res.status(422).json({
            message: {
                type: "error",
                text: "id is requiered",
            },
        });
    }

    var messages = [];
    user.ids.forEach( function (value, key) {
        var us = {_id : value};
        const finalUser = new User(us);
        result = finalUser.remove(value, function (err, doc) {
            console.log(err);
            console.log(doc);
            return !err;
        });
        if(result){
            return message= {
                type: "info",
                text: "Usuario id " + value + "eliminado",
            }
        }else{
            message= {
                type: "error",
                text: "Error al eliminar Usuario id " + value,
            }
        }
        messages.push({message});

    });
    console.log(messages);
    return res.status(200).json({
        messages
    });

});

//POST login route (optional, everyone has access)
router.post('/login', auth.optional, (req, res, next) => {
    const { body: { user } } = req;
    if(!user.email) {
        return res.status(422).json({
            message: {
                type: "error",
                text: 'user is required',
            },
        });
    }

    if(!user.password) {
        return res.status(422).json({
            message: {
                type: "error",
                text: "password is required",
            },
        });
    }

    return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
        if(err) {
            return next(err);
        }

        if(passportUser) {
            const user = passportUser;
            user.token = passportUser.generateJWT();

            return res.json({
                message: {
                    type: "info",
                    text: "Welcome back " + user.username,
                },
                user: user.toAuthJSON() });
        }

        return res.status(400).json({
            message: {
                type: "error",
                text: "user or password error",
            },
        });
        // return res.status(400).info;
    })(req, res, next);
});

//GET current route (required, only authenticated users have access)
router.get('/current', auth.required, (req, res, next) => {
    const { payload: { id } } = req;

    return User.findById(id)
        .then((user) => {
            if(!user) {
                return res.sendStatus(400);
            }

            return res.json({ user: user.toAuthJSON() });
        });
});

module.exports = router;
