var mongoose = require('mongoose');
var CommentSchemas = require('../schemas/Comment');
var Comment = mongoose.model('comment',CommentSchemas);

Comment.getCommentsByPage = function(blogId,page,cb){
    var rows = (page-1)*10;
    return Comment.find({blogId:blogId}).sort({'createDate':1}).
        skip(rows).limit(10).exec(cb);
}

module.exports = Comment;