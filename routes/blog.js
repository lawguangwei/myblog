var express = require('express');
var router = express.Router();
var UserFilter = require('../filter/UserFilter');
var Blog = require('../models/Blog');

/* GET home page. */
router.get('/', UserFilter.checkLogin,function(req, res, next) {
    var user = req.session.user;

    Blog.findByWritersAndPage(user._id,1,function(err,blogs){
        var myBlogs = '';
        if(!err){
            myBlogs = blogs;
        }
        params = {
            user:req.session.user,
            asset:{
                css:['/stylesheets/blog-index.css'],
                js:['/javascripts/blog-index.js','/ueditor/ueditor.config.js','/ueditor/ueditor.all.js']
            },
            blogs:myBlogs
        };
        res.render('blog/index',{title:'我的博文',params:params});
    });
});

router.get('/about', function(req, res) {
    res.send('About birds');
});

router.get('/write',UserFilter.checkLogin,function(req,res){
    var params = {
        user:req.session.user,
        asset:{
            css:['/stylesheets/write-blog.css'],
            js:['/javascripts/write-blog.js','/ueditor/ueditor.config.js','/ueditor/ueditor.all.js']
        }
    };
    res.render('blog/write_blog',{title:'写博文',params:params});
});

router.post('/write',UserFilter.checkLogin,function(req,res){
    var user = req.session.user;
    var title = req.body.title;
    var content = req.body.content;
    var collection = req.body.collection;
    var type = req.body.type;

    var blog = new Blog({
        title:title,
        writer:user._id,
        content:content,
        Collection:collection,
        type:type
    });

    blog.save(function(err){
        if(err){
            res.json({code:'1'});
        }else{
            res.json({code:'0'});
        }
    });
});

router.get('/check/:id',UserFilter.checkLogin,function(req,res){
    var id = req.params.id;
    console.log(id);
    Blog.findOne({_id:id},function(err,blog){
        if(err){
            console.log(err);
            res.redirect('/blog');
        }else{
            var params = {
                user:req.session.user,
                asset:{
                    css:['/stylesheets/check-blog.css'],
                    js:['/javascripts/check-blog.js']
                },
                blog:blog
            };
            res.render('blog/check_blog',{title:'查看博文',params:params});
        }
    });
});
module.exports = router;
