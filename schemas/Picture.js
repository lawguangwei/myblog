var mongoose = require('mongoose');

var PictureSchemas = new mongoose.Schema({
    name:String,
    type:String,      //图片类型
    saveType:String,
    size:String,
    path:String,
    user:String,
    album:String,
    createDate:{type:Date,default:Date.now()},
});

module.exports = PictureSchemas;