var mongoose = require('mongoose');

var PersonImgSchemas = new mongoose.Schema({
    email:String,
    imgSrc:String,
});

module.exports = PersonImgSchemas;