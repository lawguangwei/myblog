var express = require('express');
var Comment = require('../models/Comment');
var router = express.Router();
var UserFilter = require('../filter/UserFilter');

router.post('/submit',UserFilter.checkLogin,function(req,res){
    var user = req.session.user;
    var content = req.body.content;
    var blogId = req.body.blogId;

    var comment = new Comment({
        userId:user._id,
        userName:user.name,
        blogId:blogId,
        content:content
    });

    comment.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.json({code:'0'});
        }
    });
});

router.post('/getComments',function(req,res){
    var blogId = req.body.blogId;
    var page = req.body.page;
    Comment.getCommentsByPage(blogId,page,function(err,comments){
        if(err){
            console.log(err);
        }else{
            res.json({'code':'0','comments':comments});
        }
    });
});

router.post('/getPages',function(req,res){
    var blogId = req.body.blogId;
    Comment.count({blogId:blogId},function(err,nums){
        if(err){
            console.log(err);
        }else{
            var pages = nums/10+1;
            res.json({'code':'0','pages':pages});
        }
    });
});

module.exports = router;

