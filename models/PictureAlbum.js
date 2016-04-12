var mongoose = require('mongoose');
var PictureAlbumSchemas = require('../schemas/PictureAlbum');
var PictureAlbum = mongoose.model('pictureAlbum',PictureAlbumSchemas);

PictureAlbum.findByUser = function(userId,cb){
    return PictureAlbum.find().where('user').equals(userId).sort({'createDate':-1}).exec(cb);
}


module.exports = PictureAlbum;