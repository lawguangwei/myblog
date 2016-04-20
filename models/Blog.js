var mongoose = require('mongoose');
var BlogSchemas = require('../schemas/Blog');
var Blog = mongoose.model('blog',BlogSchemas);


Blog.findByWritersAndPage = function(id,page,cb){
    var rows = (page-1)*20;
    return Blog.find().where('writer').equals(id).sort({'createDate':-1}).
        skip(rows).limit(20).exec(cb);
}

Blog.getUserIndexBlog = function(id,cb){
    return Blog.find({writer:id,type:'public'}).sort({createDate:-1}).limit(5).exec(cb);
}

Blog.findByCollectionAndPage1 = function(userId,coll,page,cb){
    var rows = (page-1)*20;
    if(coll == 'all'){
        return Blog.find({writer:userId}).sort({'createDate':-1}).
            skip(rows).limit(20).exec(cb);
    }else{
        return Blog.find({Collection:coll}).sort({'createDate':-1}).
            skip(rows).limit(20).exec(cb);
    }
}
Blog.findByCollectionAndPage2 = function(userId,coll,page,cb){
    var rows = (page-1)*20;
    if(coll == 'all'){
        return Blog.find({writer:userId,type:'public'}).sort({'createDate':-1}).
            skip(rows).limit(20).exec(cb);
    }else{
        return Blog.find({Collection:coll,type:'public'}).sort({'createDate':-1}).
            skip(rows).limit(20).exec(cb);
    }
}
module.exports = Blog;