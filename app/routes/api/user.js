const mongoose = require('mongoose');
const router = require('express').Router();
const auth = require(__basedir + '/app/routes/auth');
const User = mongoose.model('Users');


router.get('/list', auth.required, (req, res, next) => {

   return User
            .find()
            .select('_id role username email created enabled')
            .exec(function (err, users) {
                if (err) return handleError(err);
                if (users){
                    return res.status(200).json({
                        message: {
                            type: "ok",
                            text: "lista de usuarios",
                        },
                        users
                    });
                }
            });
});

module.exports = router;