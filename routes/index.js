var express = require('express');
var router = express.Router();
var UserFilter = require('../filter/UserFilter');
var PersonImg = require('../models/PersonImg');
var User = require('../models/User');

/* GET home page. */
router.get('/',function(req,res,next){
    console.log(Date.now());
    if(!req.session.user){
        res.redirect('/users/login');
    }else{
        res.redirect('/users/'+req.session.user._id+'/index');
    }

});

router.get('/:url',function(req,res){
    //console.log(req.params.url);
    User.findOne({personUrl:req.params.url},function(err,user){
        if(err){
            res.send('用户不存在');
        }else{
            if(user){
                res.redirect('/users/'+user._id+'/index');
            }else{
                res.send('用户不存在');
            }
        }
    });
});


router.get('/about', function(req, res) {
  res.send('About birds');
});


module.exports = router;
