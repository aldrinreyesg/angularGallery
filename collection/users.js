
var getUserLogin = function(db, username, password) {

    return new Promise(function (res, rej) {
        if(username == null){
            res(null);
        }else {
            db.collection("users").findOne({name: username, pass: password}, function (err, result) {
                if (err) {
                    rej(err);
                } else {
                    res(result);
                }
                // db.close();
            });
        }
    });
}

var getUsers = function(db) {
    return new Promise(function (res, rej) {
        db.collection("users").find({}).toArray(function (err, result) {
            if (err) {
                rej(err);
            } else {
                res(result);
            }
        });
    });
}
module.exports.getUserLogin = getUserLogin;
module.exports.getUsers = getUsers;