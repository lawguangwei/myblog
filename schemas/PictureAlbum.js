var mongoose = require('mongoose');

var PictureAlbumSchemas = new mongoose.Schema({
    name:String,
    type:String,
    user:String,
    face:{type:String,default:'/images/test-img1.jpg'},
    createDate:{type:Date,default:Date.now()},
});

module.exports = PictureAlbumSchemas;