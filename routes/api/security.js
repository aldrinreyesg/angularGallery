const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
const User = mongoose.model('Users');

//POST new user route (optional, everyone has access)
router.post('/create', auth.optional, (req, res, next) => {
    const { body: { user } } = req;

    if(!user.email) {
        return res.status(422).json({
            errors: {
                email: 'is required',
            },
        });
    }

    if(!user.password) {
        return res.status(422).json({
            errors: {
                password: 'is required',
            },
        });
    }

    const finalUser = new User(user);

    // finalUser.setPassword(user.password);
    finalUser.create(user.username, user.email, user.password);

    return finalUser.save()
        .then(() => res.json({ user: finalUser.toAuthJSON() }));
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
