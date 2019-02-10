const crypto = require('crypto');

async function init(db) {
  var Config = db.Config;

  var default_role = await require('../roles/initiate').init(db);

  var query_result = await Config.findOrCreate({where: {name: 'default_role'}, defaults: {value: default_role.id}});
  var config_not_exist = query_result[1];
  var config = query_result[0];

  if (config_not_exist) {
    ;
  }

  return config;
}

async function get(db){
  var Config = db.Config;
  config = await Role.findOne({where: {name: 'default_role'}});
  return config;
}

module.exports = {
  init,
  get
}