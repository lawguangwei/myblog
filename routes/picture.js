var express = require('express');
var router = express.Router();
var UserFilter = require('../filter/UserFilter');
var User = require('../models/User');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var fs = require('fs');
var Picture = require('../models/Picture');
var PictureAlbum = require('../models/PictureAlbum');


function getUserId(path){
    var paths = path.split('/');
    return paths[2];
}

router.get('/',UserFilter.isMe,function(req,res){
    var userId = getUserId(req.baseUrl);
    PictureAlbum.findByUser(userId,function(err,albums){
        if(err){
            console.log(err);
            res.send('500 Server Error');
        }else{
            var params = {
                user:req.session.user,
                asset:{
                    css:['/stylesheets/picture-index.css'],
                    js:['/javascripts/picture-index.js']
                },
                albums:albums,
                ownerId:userId,
                isMe:true
            };
            res.render('picture/index',{title:'相册',params:params});
        }
    });
});

router.get('/',function(req,res){
    var userId = getUserId(req.baseUrl);
    PictureAlbum.findByUser(userId,function(err,albums){
        if(err){
            console.log(err);
            res.send('500 Server Error');
        }else{
            var params = {
                asset:{
                    css:['/stylesheets/picture-index.css'],
                    js:['/javascripts/picture-index.js']
                },
                albums:albums,
                ownerId:userId,
                isMe:false,
            };
            res.render('picture/index',{title:'相册',params:params});
        }
    });
});

router.get('/upload',UserFilter.checkLogin,function(req,res){
    var params = {
        user:req.session.user,
        asset:{
            css:['/stylesheets/upload-picture.css'],
            js:['/javascripts/upload-picture.js']
        }
    };
    res.render('picture/upload',{title:'上传文件',params:params});
});

router.post('/upload',UserFilter.checkLogin,multipartMiddleware,function(req,res){
    var user = req.session.user;
    var file = req.files.file;
    var albumId = req.body.album;
    if(!fs.existsSync('./public/userImage/'+user._id)){
        fs.mkdirSync('./public//userImage/'+user._id);
    }
    var extName = '';  //后缀名
    switch (file.type) {
        case 'image/jpeg':
            extName = 'jpeg';
            break;
        case 'image/jpg':
            extName = 'jpg';
            break;
        case 'image/png':
            extName = 'png';
            break;
        case 'image/x-png':
            extName = 'png';
            break;
    }
    var targetPath = './public/userImage/'+user._id+'/'+user._id + file.name + Date.parse(new Date())+'.'+extName;
    fs.rename(file.path,targetPath,function(err){
        if(err){
            res.json({code:'1'});
        }else{
            PictureAlbum.findOne({_id:albumId},function(err,album){
                var picture = new Picture({
                    name:file.name,
                    type:file.type,
                    saveType:album.type,
                    size:file.size,
                    path:targetPath,
                    user:user._id,
                    album:album._id,
                });
                picture.save(function(err){
                    if(err){
                        res.json({code:'1'});
                    }else{
                        res.json({code:'0'});
                    }
                });
            });
        }
    });
});


router.post('/createAlbum',UserFilter.checkLogin,function(req,res){
    var user = req.session.user;
    var name = req.body.name;
    var type = req.body.type;
    var pictureAlbum = new PictureAlbum({
        name:name,
        type:type,
        user:user._id
    });
    pictureAlbum.save(function(err){
        if(err){
            console.log(err);
            res.json({code:'1'});
        }else{
            res.json({code:'0'});
        }
    });
});

router.get('/getAlbum',UserFilter.checkLogin,function(req,res){
    var userId = req.session.user._id;
    PictureAlbum.findByUser(userId,function(err,albums){
        if(err){
            res.json({code:'1'});
        }else{
            res.json({code:'0',albums:albums});
        }
    });
});

router.get('/checkAlbum/:id',UserFilter.isMe,function(req,res){
    var userId = getUserId(req.baseUrl);
    var albumId = req.params.id;
    Picture.findByAlbumAndPage(userId,albumId,1,function(err,pictures){
        if(err){
            console.log(err);
            res.send('500 server error');
        }else{
            var params = {
                user:req.session.user,
                asset:{
                    css:['/stylesheets/album.css'],
                    js:['/javascripts/album.js']
                },
                pictures:pictures,
                ownerId:userId,
                isMe:true
            };
            res.render('picture/album',{title:'相册',params:params});
        }
    });
});

router.get('/checkAlbum/:id',function(req,res){
    var userId = getUserId(req.baseUrl);
    var albumId = req.params.id;
    Picture.findByAlbumAndPage(userId,albumId,1,function(err,pictures){
        if(err){
            console.log(err);
            res.send('500 server error');
        }else{
            var params = {
                asset:{
                    css:['/stylesheets/album.css'],
                    js:['/javascripts/album.js']
                },
                pictures:pictures,
                ownerId:userId,
                isMe:false
            };
            res.render('picture/album',{title:'相册',params:params});
        }
    });
});

router.post('/setAlbumFace',UserFilter.checkLogin,function(req,res){
    var albumId = req.body.albumId;
    var src = req.body.src;
    PictureAlbum.update({_id:albumId},{$set:{face:src}},{upsert:true},function(err){
        if(err){
            res.json({'code':'1'});
        }else{
            res.json({'code':'0'});
        }
    });
});

router.post('/getIndexPictures',function(req,res){
    var ownerId = req.body.ownerId;
    Picture.getIndexPictures(ownerId,function(err,pictures){
        res.json({'code':'0', 'pictures':pictures});
    });
});


module.exports = router;
