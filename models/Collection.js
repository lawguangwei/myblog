var mongoose = require('mongoose');
var CollectionSchemas = require('../schemas/Collection');
var Collection = mongoose.model('collection',CollectionSchemas);

Collection.findByUser = function(userId,cb){
    return Collection.find().where('user').equals(userId).sort({'createDate':-1}).exec(cb);
}

module.exports = Collection;