const crypto = require('crypto');

async function init(db) {
  var User = db.User;
  var Role = db.Role;

  var query_result = await Role.findOrCreate({where: {name: 'manager'}, defaults: {alias: "Pengurus"}});
  var role_not_exist = query_result[1];
  var role = query_result[0];

  if (role_not_exist) {
    ;
  }

  return role;
}

module.exports = init;