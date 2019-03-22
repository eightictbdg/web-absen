var DefaultRole = require('./default_role');

var instances = {
  DefaultRole
};

for (var key in instances) {
  var instance = instances[key];

  instance.callback = instance.callback || function() {;};

  instance.init = async function(db) {
    var Config = db.Config;

    var query_result = await Config.findOrCreate({where: {name: this.name}, defaults: {value: this.value}});
    var config_not_exist = query_result[1];
    var config = query_result[0];

    if (config_not_exist) {
      await this.callback(db);
    }

    return config;
  }

  instance.get = async function(db) {
    var Config = db.Config;
    var config = await Role.findOne({where: {name: this.name}});
    return config;
}
}

module.exports = instances;