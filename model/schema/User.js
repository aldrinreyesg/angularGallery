var mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    hash: String,
    salt: String,
    role: {
        type: String,
        required: true,
        default: 'User'
    },
    created: {
        type: Date,
        required: true,
        default: Date.now
    },
    token: {
        type: String,
        required: false
    },
    last: {
        type: Date,
        required: false
    },
    enabled: {
        type: Boolean,
        required: true
    }
});

userSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

userSchema.methods.validatePassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

userSchema.methods.generateJWT = function() {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    return jwt.sign({
        username: this.username,
        email: this.email,
        id: this._id,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, 'secret');
};

userSchema.methods.toAuthJSON = function() {
    return {
        _id: this._id,
        email: this.email,
        token: this.generateJWT(),
    };
};


userSchema.methods.create = function (username, email, password) {
    if(username) {
        this.username = username;
    }else{
        this.username = this.email.substring(0, this.email.indexOf('@'));
    }
    if(email){
        this.email = email;
    }
    this.enabled = true;
    this.setPassword(password);
}

var Users = mongoose.model('Users', userSchema);
module.exports.userModel = Users;
