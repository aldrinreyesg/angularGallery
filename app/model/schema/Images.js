var mongoose = require('mongoose');

var imagesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
        trim: true
    },
    descript: {
        type: String,
        required: false,
        trim: true
    },
    filename: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        required: true
    },
    galleryid: {
        type:String,
        required: true
    },
    public: {
        type: boolean,
        default: true
    },
    url: {
        type: String,
        required: false
    },
    created: {
        type: Date,
        required: true,
        default: Date.now
    },

});


var Images = mongoose.model('Images', imagesSchema);
module.exports.imagesModel = Images;