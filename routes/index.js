var express = require('express');
var router = express.Router();
var UserFilter = require('../filter/UserFilter');
var PersonImg = require('../models/PersonImg');
var User = require('../models/User');

/* GET home page. */
router.get('/',UserFilter.checkLogin,function(req,res){
    res.redirect('/users/'+req.session.user._id+'/index');
});

router.get('/about', function(req, res) {
  res.send('About birds');
});


module.exports = router;
