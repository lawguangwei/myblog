var express = require('express');
var router = express.Router();
var UserFilter = require('../filter/UserFilter');
var Blog = require('../models/Blog');
var User = require('../models/User');
var Collection = require('../models/Collection');

function getUserId(path){
    var paths = path.split('/');
    console.log(paths);
    return paths[2];
}
/* GET home page.
* 是本人
* */

router.get('/',UserFilter.isMe,function(req, res ,next) {
    var userId = getUserId(req.baseUrl);
    User.findOne({_id:userId},function(err,user){
       if(err){
           console.log(err);
           res.send('500 Error!');
       }else{
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
                   blogs:myBlogs,
                   ownerId:req.session.user._id,
                   isMe:true
               };
               res.render('blog/index',{title:'我的博文',params:params});
           });
       }
    });
});
/*
*不是本人
 */
router.get('/',function(req, res ,next) {
    var userId = getUserId(req.baseUrl);
    User.findOne({_id:userId},function(err,user){
        if(err){
            console.log(err);
            res.send('500 Error!');
        }else{
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
                    blogs:myBlogs,
                    ownerId:userId,
                    isMe:false
                };
                res.render('blog/index',{title:'我的博文',params:params});
            });
        }
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

router.get('/modify/:id',UserFilter.checkLogin,function(req,res,next){
    var blogId = req.params.id;
    Blog.findOne({_id:blogId},function(err,blog){
        if(err){
            console.log(err);
            res.redirect('/blog');
        }else{
            var params = {
                user:req.session.user,
                asset:{
                    css:['/stylesheets/write-blog.css'],
                    js:['/javascripts/modify-blog.js','/ueditor/ueditor.config.js','/ueditor/ueditor.all.js']
                },
                blog:blog
            };
            res.render('blog/modify_blog',{title:'修改',params:params});
        }
    });
});

router.post('/modify',UserFilter.checkLogin,function(req,res){
    var blogId = req.body.blogId;
    var title = req.body.title;
    var content = req.body.content;
    var collection = req.body.collection;
    var type = req.body.type;

    Blog.update({_id:blogId},{$set:{title:title,content:content,
        Collection:collection,type:type}},{upsert:true},function(err){
        if(err){
            res.json({code:'1',blogId:blogId});
        }else{
            res.json({code:'0',blogId:blogId});
        }
    });
});


router.get('/check/:id',UserFilter.isMe,function(req,res){
    var id = req.params.id;
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
                isMe:true,
                ownerId:req.session.user._id,
                blog:blog
            };
            res.render('blog/check_blog',{title:'查看博文',params:params});
        }
    });
});


router.get('/check/:id',function(req,res){
    var id = req.params.id;
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
                isMe:false,
                ownerId:getUserId(req.baseUrl),
                blog:blog
            };
            res.render('blog/check_blog',{title:'查看博文',params:params});
        }
    });
});


router.post('/deleteBlog',UserFilter.checkLogin,function(req,res){
    var userId = req.session.user._id;
    var blogId = req.body.blogId;
    Blog.remove({writer:userId,_id:blogId},function(err){
        if(err){
            res.json({code:'1',error:err});
        }else{
            res.json({code:'0'});
        }
    });
});


router.post('/createCollect',UserFilter.checkLogin,function(req,res){
    var name = req.body.name;
    var type = req.body.type;
    var collection = new Collection({
        collectionName : name,
        user : req.session.user._id,
        type : type,
    });
    collection.save(function(err){
        if(err){
            res.json({code:'1',msg:'创建错误'});
        }else{
            res.json({code:'0',msg:'创建成功',collection:collection});
        }
    });
});

router.get('/getCollect',UserFilter.checkLogin,function(req,res){
    var userId = req.session.user._id;
    Collection.findByUser(userId,function(err,collections){
        if(err){
            res.json({code:'1'});
        }else{
            res.json({code:'0',collections:collections});
        }
    });
});
module.exports = router;
