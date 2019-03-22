var Design = require('./design');
var Gaming = require('./gaming');
var Programming = require('./programming');

var instances = {
  Design,
  Gaming,
  Programming
};

for (var key in instances) {
  var instance = instances[key];

  instance.callback = instance.callback || function() {;};

  instance.init = async function(db) {
    var Division = db.Division;
    var query_result = await Division.findOrCreate({where: {name: this.name}});
    var not_exist = query_result[1];
    var result = query_result[0];
    if (not_exist) {
      this.callback(db);
    }
    return result;
  }

  instance.get = async function(db) {
    var Division = db.Division;
    var result = await Division.findOne({where: {name: this.name}});
    return result;
  }
}

module.exports = instances;