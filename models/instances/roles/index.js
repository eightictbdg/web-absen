var Admin = require('./admin');
var Manager = require('./manager');
var Member = require('./member');
var Initiate = require('./initiate');

var instances = {Admin, Manager, Member, Initiate};

for (var key in instances) {
  var instance = instances[key];

  instance.callback = instance.callback || async function() {;};

  instance.init = async function(db) {
    var Role = db.Role;
    var query_result = await Role.findOrCreate({where: {name: this.name}});
    var not_exist = query_result[1];
    var result = query_result[0];
    if (not_exist) {
      await this.callback(db);
    }
    return result;
  }

  instance.get = async function(db) {
    var Role = db.Role;
    var result = await Role.findOne({where: {name: this.name}});
    return result;
  }
}

module.exports = instances;