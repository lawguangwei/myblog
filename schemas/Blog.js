var mongoose = require('mongoose');

var BlogSchemas = new mongoose.Schema({
    title:String,
    writer:String,
    content:String,
    Collection:String,
    type:{type:String},
    createDate:{type:Date,default:Date.now()},
});


module.exports = BlogSchemas;