var mongoose = require('mongoose');

var CollectionSchemas = new mongoose.Schema({
    collectionName:String,
    user:String,
    createDate:{type:Date,default:Date.now()},
});

module.exports = CollectionSchemas;