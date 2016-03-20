var mongoose = require('mongoose');
var PersonImgSchemas = require('../schemas/PersonImg');
var PersonImg = mongoose.model('personImg',PersonImgSchemas);

module.exports = PersonImg;