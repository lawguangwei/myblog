/**
 * Created by luoguangwei on 16/3/18.
 */
var User = require('../models/User');
var Blog = require('../models/Blog');

var UserFiler = {
    checkRegister:function(req,res,next){
        var email = req.body.email;
        var name = req.body.name;
        if(email == ''){
            res.render('user/user_register',{title:'用户注册',msg:'邮箱不能为空'});
        }else{
            if(name == ''){
                res.render('user/user_register',{title:'用户注册',msg:'用户名不能为空'});
            }else{
                User.findByEmail(email,function(err,user){
                    if(err) return handleError(err);
                    if(user != null){
                        res.render('user/user_register',{title:'用户注册',msg:'邮箱已注册'});
                    }else{
                        var pass1 = req.body.pass1;
                        var pass2 = req.body.pass2;
                        if(pass1 == '' || pass2 == ''){
                            res.render('user/user_register',{title:'用户注册',msg:'密码不能为空'});
                        }else{
                            if(pass1 != pass2){
                                res.render('user/user_register',{title:'用户注册',msg:'两次输入密码不正确'});
                            }else{
                                next();
                            }
                        }
                    }
                });
            }
        }
    },

    checkLogin:function(req,res,next){
        if(!req.session.user){
            res.redirect('/users/login');
        }else{
            next();
        }
    },

    isMe:function(req,res,next){
        var userId = getUserId(req.baseUrl);
        if(!req.session.user){
            next('route');
        }else{
            if(userId == req.session.user._id){
                next();
            }else{
                next('route');
            }
        }
    }
}

function getUserId(path){
    var paths = path.split('/');
    console.log(paths);
    return paths[2];
}

module.exports = UserFiler;