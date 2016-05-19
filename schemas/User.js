/**
 * Created by luoguangwei on 16/3/18.
 */
var mongoose = require('mongoose');

var UserSchemas = new mongoose.Schema({
    email:String,
    name:String,
    password:String,
    gender:{type:String,default:'男'},
    birthday:{type:String},
    experience:{
        college:String,
        high:String,
        middle:String,
        company:String,
    },
    marriage:{type:String,default:'单身'},
    personUrl:String,
    personInfo:String
});

UserSchemas.statics = {
    findByEmail:function(email,cb){
        return this.findOne({email:email}).exec(cb);
    },
};


module.exports = UserSchemas;