const crypto = require('crypto');

const name = 'Pengurus'

async function init(db) {
  var User = db.User;
  var Role = db.Role;

  var query_result = await Role.findOrCreate({where: {name: name}});
  var role_not_exist = query_result[1];
  var role = query_result[0];

  if (role_not_exist) {
    ;
  }

  return role;
}

async function get(db){
  var Role = db.Role;
  role = await Role.findOne({where: {name: name}});
  return role;
}

module.exports = {
  init,
  get
}