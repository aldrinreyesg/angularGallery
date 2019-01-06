
var getUserImages = function(db, username) {

    return new Promise(function (res, rej) {
        if(username == null){
            res(null);
        }else {
            db.collection("users").findOne({name: username}, function (err, userDoc) {
                if (err) {
                    reject(err);
                } else {
                    db.collection("galleries").find({userid: userDoc.id}, function (gerr, gallDoc) {
                        if (err) {
                            reject(gerr);
                        } else {
                            console.log(gallDoc.toArray());
                            db.collection("images").find({galleryid: gallDoc.id}).toArray (function (ierr, result) {
                                if (err) {
                                    reject(ierr);
                                } else {
                                    res(result);
                                }
                            })
                        }
                    })
                }
                // db.close();
            });
        }
    });
}

var getImages = function(db) {
    return new Promise(function (res, rej) {
        db.collection("images").find({}).toArray(function (err, result) {
            if (err) {
                rej(err);
            } else {
                res(result);
            }
        });
    });
}
module.exports.getUserImages = getUserImages;
module.exports.getImages = getImages;