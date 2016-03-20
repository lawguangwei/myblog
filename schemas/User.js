/**
 * Created by luoguangwei on 16/3/18.
 */
var mongoose = require('mongoose');

var UserSchemas = new mongoose.Schema({
    email:String,
    name:String,
    password:String,
    gender:String,
    birthDay:{type:Date,default:Date.now},
    personInfo:String,
});

UserSchemas.statics = {
    findByEmail:function(email,cb){
        return this.findOne({email:email}).exec(cb);
    },
};


module.exports = UserSchemas;