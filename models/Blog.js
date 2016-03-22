var mongoose = require('mongoose');
var BlogSchemas = require('../schemas/Blog');
var Blog = mongoose.model('blog',BlogSchemas);


Blog.findByWritersAndPage = function(id,page,cb){
    var rows = (page-1)*20;
    return Blog.find().where('writer').equals(id).sort({'createDate':-1}).
        skip(rows).limit(20).exec(cb);
}

module.exports = Blog;