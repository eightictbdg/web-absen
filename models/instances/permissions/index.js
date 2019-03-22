var Panel = require('./panel');
var instances = {
  Panel
};

for (var key in instances) {
  var group = instances[key];

  for (var subkey in group) {
    var instance = group[subkey];
    instance.callback = instance.callback || function() {;};
    instance.init = async function(db) {
      var Permission = db.Permission;
      var query_result = await Permission.findOrCreate({where: {name: this.name}});
      var not_exist = query_result[1];
      var result = query_result[0];
      if (not_exist) {
        this.callback(db);
      }
      return result;
    }
    instance.get = async function(db) {
      var Permission = db.Permission;
      var result = await Permission.findOne({where: {name: this.name}});
      return result;
    }
  }

  group.init = async function(db) {
    for (var x in this) {
      if (x != 'init') await this[x].init(db);
    }
  }
}

module.exports = instances;