var mongoose = require('mongoose');
var UserSchemas = require('../schemas/User');
var User = mongoose.model('User',UserSchemas);

User.register = function(email,name,password,req,res){
    var user = new User({
        email:email,
        name:name,
        password:password
    });
    user.save(function(err){
        if (err){
            res.send(handleError(err));
        }else{
            req.session.user = user;
            res.send('注册成功');
        }
    });
}


module.exports = User;