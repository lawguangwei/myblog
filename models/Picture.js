var mongoose = require('mongoose');
var PictureSchemas = require('../schemas/Picture');
var Picture = mongoose.model('picture',PictureSchemas);

Picture.findByAlbumAndPage = function(userId,albumId,page,cb){
    var rows = (page-1)*20;
    return Picture.find({user:userId,album:albumId}).sort({'createDate':-1}).
        skip(rows).limit(20).exec(cb);
}

Picture.getIndexPictures = function(userId,cb){
    return Picture.find({user:userId,saveType:'public'}).exec(cb);
}

module.exports = Picture;