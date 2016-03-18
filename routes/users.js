var express = require('express');
var router = express.Router();

var User = require('../models/User');
var crypto = require('crypto');
var UserFilter = require('../filter/UserFilter');


var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/myblog');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (msg) {
    console.log('mongodb connected');
});


/* GET users listing. */
router.get('/',UserFilter.checkLogin, function(req, res) {
    res.send(req.session.user);
});

router.get('/login', function(req, res) {
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
                   res.redirect('/users');
               }else{
                   res.render('user/user_login',{title:'用户登录',msg:'密码错误'});
               }
           }
       }
    });
});

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





module.exports = router;
