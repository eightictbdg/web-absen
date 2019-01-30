const crypto = require('crypto');

async function init(db) {
  var User = db.User;
  var Role = db.Role;

  var query_result = await Role.findOrCreate({where: {name: 'admin'}, defaults: {alias: "Administrator"}});
  var role_not_exist = query_result[1];
  var role = query_result[0];

  if (role_not_exist) {
    // defining default user 'admin'
    var admin = await User.create({
      name: 'Administrator',
      username: 'admin',
      password: crypto.createHash('sha512').update('admin').digest('hex')
    });
    role.setUser(admin);
  }

  return role;
}

module.exports = init;