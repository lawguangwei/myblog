var mongoose = require('mongoose');

var CommentSchemas = new mongoose.Schema({
    blogId:String,
    userId:String,
    userName:String,
    content:String,
    createDate:{type:Date,default:new Date()},
});

module.exports = CommentSchemas;