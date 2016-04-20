var mongoose = require('mongoose');
var PictureAlbumSchemas = require('../schemas/PictureAlbum');
var PictureAlbum = mongoose.model('pictureAlbum',PictureAlbumSchemas);

PictureAlbum.findByUser = function(userId,cb){
    return PictureAlbum.find().where('user').equals(userId).sort({'createDate':-1}).exec(cb);
}

PictureAlbum.findByUserAndPage1 = function(userId,page,cb){
    var rows = (page-1)*16;
    return PictureAlbum.find({user:userId}).sort({'createDate':-1}).
        skip(rows).limit(16).exec(cb);
}

PictureAlbum.findByUserAndPage2 = function(userId,page,cb){
    var rows = (page-1)*16;
    return PictureAlbum.find({user:userId,type:'public'}).sort({'createDate':-1}).
        skip(rows).limit(16).exec(cb);
}


module.exports = PictureAlbum;