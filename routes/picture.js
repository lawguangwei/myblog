var express = require('express');
var router = express.Router();
var UserFilter = require('../filter/UserFilter');
var User = require('../models/User');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var fs = require('fs');
var Picture = require('../models/Picture');
var PictureAlbum = require('../models/PictureAlbum');
var formidable=require('formidable');


function getUserId(path){
    var paths = path.split('/');
    return paths[2];
}


router.get('/',UserFilter.isMe,function(req,res){
    var userId = getUserId(req.baseUrl);
    var params = {
        user:req.session.user,
        asset:{
            css:['/stylesheets/index.css','/stylesheets/picture-index.css'],
            js:['/javascripts/picture-index.js']
        },
        owner:req.session.user,
        ownerId:userId,
        isMe:true
    };
    res.render('picture/index',{title:'相册',params:params});
});


router.get('/',function(req,res){
    var userId = getUserId(req.baseUrl);
    User.findOne({'_id':userId},function(err,user){
        if(err){
            console.log(err);
            res.send('error');
        }else{
            var params = {
                asset:{
                    css:['/stylesheets/index.css','/stylesheets/picture-index.css'],
                    js:['/javascripts/picture-index.js']
                },
                user:req.session.user,
                owner:user,
                ownerId:userId,
                isMe:false,
            };
            res.render('picture/index',{title:'相册',params:params});
        }
    })
});

router.post('/getAlbums',UserFilter.isMe,function(req,res){
    var userId = req.body.userId;
    var page = req.body.page;
    PictureAlbum.findByUserAndPage1(userId,page,function(err,albums){
        if(err){
            console.log(err);
            res.json({'code':'1'});
        }else{
            res.json({'code':'0','albums':albums,'isMe':true})
        }
    });
});

router.post('/getAlbums',function(req,res){
    var userId = req.body.userId;
    var page = req.body.page;
    PictureAlbum.findByUserAndPage2(userId,page,function(err,albums){
        if(err){
            console.log(err);
            res.json({'code':'1'});
        }else{
            res.json({'code':'0','albums':albums,'isMe':false})
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
    var targetPath = './public/userImage/'+user._id+'/'+user._id + Date.now() + file.name;
    var form = new formidable.IncomingForm();
    form.uploadDir = "./tmp";
    fs.rename(file.path,targetPath,function(err){
        if(err){
            console.log(err);
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
                    createDate:Date.now()
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
        user:user._id,
        createDate:Date.now()
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
    Picture.findByAlbumAndPage1(userId,albumId,1,function(err,pictures){
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
                albumId:albumId,
                isMe:true
            };
            res.render('picture/album',{title:'相册',params:params});
        }
    });
});

router.get('/checkAlbum/:id',function(req,res){
    var userId = getUserId(req.baseUrl);
    var albumId = req.params.id;
    Picture.findByAlbumAndPage2(userId,albumId,1,function(err,pictures){
        if(err){
            console.log(err);
            res.send('500 server error');
        }else{
            var params = {
                asset:{
                    css:['/stylesheets/album.css'],
                    js:['/javascripts/album.js']
                },
                user:req.session.user,
                pictures:pictures,
                albumId:albumId,
                ownerId:userId,
                isMe:false
            };
            res.render('picture/album',{title:'相册',params:params});
        }
    });
});

router.post('/getAlbumPictures',UserFilter.isMe,function(req,res){
    var userId = req.body.userId;
    var albumId = req.body.albumId;
    var page = req.body.page;
    Picture.findByAlbumAndPage1(userId,albumId,page,function(err,pictures){
        if(err){
            console.log(err);
            res.json({'code':'1'});
        }else{
            res.json({'code':'0','pictures':pictures,'isMe':true});
        }
    });
});

router.post('/getAlbumPictures',function(req,res){
    var userId = req.body.userId;
    var albumId = req.body.albumId;
    var page = req.body.page;
    Picture.findByAlbumAndPage2(userId,albumId,page,function(err,pictures){
        if(err){
            console.log(err);
            res.json({'code':'1'});
        }else{
            res.json({'code':'0','pictures':pictures,'isMe':false});
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

router.post('/deletePicture',UserFilter.checkLogin,function(req,res){
    var pictureId = req.body.pictureId;
    Picture.remove({'_id':pictureId},function(err){
        if(err){
            console.log(err);
            res.json({'code':'1'})
        }else{
            res.json({'code':'0'});
        }
    });
});

router.post('/configAlbum',UserFilter.checkLogin,function(req,res){
    var albumId = req.body.albumId;
    var albumName = req.body.albumName;
    var albumType = req.body.albumType;

    PictureAlbum.update({_id:albumId},{$set:{name:albumName,type:albumType}},{multi:true},function(err){
        if(err){
            res.json({'code':'1'});
        }else{
            Picture.update({album:albumId},{$set:{saveType:albumType}},{multi:true},function(err){
                if(err){
                    res.json({'code':'1'});
                }else{
                    res.json({'code':'0'});
                }
            })
        }
    });

});

router.post('/removeAlbum',UserFilter.checkLogin,function(req,res){
    var albumId = req.body.albumId;
    Picture.remove({album:albumId},function(err){
        if(err){
            console.log(err);
            res.json({'code':'1'});
        }else{
            PictureAlbum.remove({_id:albumId},function(err){
                if(err){
                    console.log(err);
                    res.json({'code':'1'});
                }else{
                    res.json({'code':'0'});
                }
            });
        }
    });
});

router.post('/getAlbumPages',UserFilter.isMe,function(req,res){
    var userId = req.body.userId;
    PictureAlbum.count({user:userId},function(err,nums){
        if(err){
            console.log(err);
        }else{
            var pages = nums/16+1;
            res.json({'code':'0','pages':pages});
        }
    });
});
router.post('/getAlbumPages',function(req,res){
    var userId = req.body.userId;
    PictureAlbum.count({user:userId,type:'public'},function(err,nums){
        if(err){
            console.log(err);
        }else{
            var pages = nums/16+1;
            res.json({'code':'0','pages':pages});
        }
    });
});


router.post('/getPicturePages',function(req,res){
    var albumId = req.body.albumId;
    Picture.count({album:albumId},function(err,nums){
        if(err){
            console.log(err);
        }else{
            console.log(nums);
            var pages = nums/12+1;
            res.json({'code':'0','pages':pages});
        }
    });
});



module.exports = router;
