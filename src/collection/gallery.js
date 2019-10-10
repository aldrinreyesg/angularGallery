
var getUserGalleries = function(db, username) {

    return new Promise(function (res, rej) {
        if(username == null){
            res(null);
        }else {
            db.collection("users").findOne({name: username}, function (err, userDoc) {
                if (err) {
                    reject(err);
                } else {
                    console.log(userDoc);
                    db.collection("galleries").find({userid: userDoc.id}).toArray(function (gerr, result) {
                        if (err) {
                            reject(gerr);
                        } else {
                            res(result);
                        }
                    })
                }
                // db.close();
            });
        }
    });
}

var getGalleries = function(db) {
    return new Promise(function (res, rej) {
        db.collection("galleries").find({}).toArray(function (err, result) {
            if (err) {
                rej(err);
            } else {
                res(result);
            }
        });
    });
}
module.exports.getUserGalleries = getUserGalleries;
module.exports.getGalleries = getGalleries;