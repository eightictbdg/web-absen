const crypto = require('crypto');

module.exports.name = 'Calon Anggota';

module.exports.callback = async function(db) {
  var Role = db.Role;
  var User = db.User;
  var role = await Role.findOne({where: {name: module.exports.name}});
  
  var permission = require('../permissions');

  var permAttend = await permission.Panel.Attend.init(db);

  permAttend.RolePermission = {perm: 'c'};
  
  var permission_list = [
    permAttend
  ];
  
  await role.setPermissions(permission_list);
}