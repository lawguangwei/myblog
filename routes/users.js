var express = require('express');
var router = express.Router();

var User = require('../models/User');
var PersonImg = require('../models/PersonImg');


var crypto = require('crypto');
var UserFilter = require('../filter/UserFilter');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();


var mongoose = require('mongoose');
var Grid = require('gridfs-stream');


mongoose.connect('mongodb://localhost/myblog');
var conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'connection error:'));
conn.once('open', function (msg) {
    console.log('mongodb connected');
});


router.get('/:id/index',UserFilter.checkLogin, function(req, res,next) {
    var userId = req.params.id;
    User.findOne({_id:userId},function(err,user){
        if(err){
            console.log('error');
            res.send('500 Eorror');
        }else{
            PersonImg.findOne({email:user.email},function(err,img){
                var image = '/images/person-img.png';
                if(!err){
                    if(img){
                        image = img.imgSrc;
                    }
                }
                var params = {
                    asset: {
                        js:['/javascripts/index.js'],
                        css:['/stylesheets/index.css']
                    },
                    user:req.session.user,
                    image:image
                }
                res.render('user/user_index',{title:'用户主页',params:params});
            });
        }
    });
});

/* GET users listing. */
/**
 * 用户登录路由
 */
router.get('/login',function(req, res) {
    res.render('user/user_login',{title:'用户登录'});
});


router.post('/login',function(req,res){
    var email = req.body.email;
    var password = req.body.password;
    var md5 = crypto.createHash('md5');
    md5.update(password);
    password = md5.digest('hex');
    User.findByEmail(email,function(err,user){
       if(err){
           res.send(handlerError(err));
       } else{
           if(user == null){
               res.render('user/user_login',{title:'用户登录',msg:'账户不存在'});
           }else{
               if(user.password == password){
                   req.session.user = user;
                   res.redirect('/users/'+user._id+'/index');
               }else{
                   res.render('user/user_login',{title:'用户登录',msg:'密码错误'});
               }
           }
       }
    });
});

/**
 *
 */
router.get('/logout',function(req,res,next){
    if(req.session.user){
        req.session.destroy();
    }
    res.redirect('/');
});
/**
 * 用户注册路由
 */
router.get('/register', function(req, res) {
    res.render('user/user_register',{title:'用户注册'});
});

router.post('/register',UserFilter.checkRegister,function(req,res){
    var email = req.body.email;
    var name = req.body.name;
    var password = req.body.pass1;
    var md5 = crypto.createHash('md5');
    md5.update(password);
    password = md5.digest('hex');
    User.register(email,name,password,req,res);
});


router.get('/info',UserFilter.checkLogin,function(req,res,next){
    var user = req.session.user;

    PersonImg.findOne({email:user.email},function(err,img){
        var image = '/images/person-img.png';
        if(!err){
            if(img){
                image = img.imgSrc;
            }
        }
        var params = {
            asset: {
                js:['/javascripts/info.js','/javascripts/cropbox.js'],
                css:['/stylesheets/info.css']
            },
            user:req.session.user,
            image:image
        }
        res.render('user/user_info',{title:'用户信息',params:params});
    });


});


/**
router.post('/setImg',UserFilter.checkLogin,multipartMiddleware,function(req,res,next){
    var file = req.files.file;
    var gfs_options = {
        filename: file.name,
        mode: 'w',
        content_type: file.type,
        metadata:{
            user:req.session.user.email
        }
    };
    var gfs = Grid(conn.db, mongoose.mongo);
    var writestream = gfs.createWriteStream(gfs_options);
    fs.createReadStream(file.path).pipe(writestream);
    writestream.on('close', function() {
        fs.unlink(file.path, function(err) {
            if (err) {
                res.send('error');
            }else{
                res.send('suucess');
            }
        });
    });
});
 */
router.post('/setImg',UserFilter.checkLogin,function(req,res,next){
    var email = req.session.user.email;
    var img = req.body.img;
    PersonImg.update({email:email},{$set:{imgSrc:img}},{upsert:true},function(err){
        if(err){
            res.json({'code':'1',err:err});
        }else{
            res.json({'code':'0',img:img});
        }
    });
});

router.get('/checkImg',function(rep,res,next){
    var gfs = Grid(conn.db, mongoose.mongo);
    var readstream = gfs.createReadStream({
        _id: '56ed765853a0dcf89bb7320f'
    });
    readstream.pipe(res);
});

router.post('/setBaseInfo',UserFilter.checkLogin,function(req,res,next){
    var email = req.session.user.email;
    var name = req.body.name;
    var gender = req.body.gender;
    var birthday =req.body.birthday;
    var marriage = req.body.marriage;
    User.update({email:email},{$set:{name:name,gender:gender,birthday:birthday,marriage:marriage}},{upsert:true},function(err){
        if(err){
            console.log(err);
            res.json({code:'1'});
        }else{
            User.findOne({email:email},function(err,user){
               if(err){
                   console.log(err);
                   res.json({code:'1'});
               }else{
                   req.session.user = user;
                   res.json({code:'0'});
               }
            });
        }
    });
});

router.post('/setExperience',UserFilter.checkLogin,function(req,res,next){
    var email = req.session.user.email;
    var college = req.body.college;
    var high = req.body.high;
    var middle =req.body.middle;
    var company = req.body.company;
    User.update({email:email},{$set:{experience:{college:college,high:high,middle:middle,company:company}}},{upsert:true},function(err){
        if(err){
            console.log(err);
            res.json({code:'1'});
        }else{
            User.findOne({email:email},function(err,user){
                if(err){
                    console.log(err);
                    res.json({code:'1'});
                }else{
                    req.session.user = user;
                    res.json({code:'0'});
                }
            });
        }
    });
});

router.post('/setPersonInfo',UserFilter.checkLogin,function(req,res,next){
    var email = req.session.user.email;
    var info = req.body.info;
    User.update({email:email},{$set:{personInfo:info}},{upsert:true},function(err){
        if(err){
            console.log(err);
            res.json({code:'1'});
        }else{
            User.findOne({email:email},function(err,user){
                if(err){
                    console.log(err);
                    res.json({code:'1'});
                }else{
                    req.session.user = user;
                    res.json({code:'0'});
                }
            });
        }
    });
});


module.exports = router;
