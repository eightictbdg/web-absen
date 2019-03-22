const crypto = require('crypto');

module.exports.name = 'Administrator';

module.exports.callback = async function(db) {
  var Role = db.Role;
  var User = db.User;
  var role = await Role.findOne({where: {name: module.exports.name}});
  
  var permission = require('../permissions');

  var permRole = await permission.Panel.Role.init(db);
  var permDivision = await permission.Panel.Division.init(db);
  var permUser = await permission.Panel.User.init(db);
  var permSchedule = await permission.Panel.Schedule.init(db);
  var permConfig = await permission.Panel.Config.init(db);
  var permPermission = await permission.Panel.Permission.init(db);
  var permCSV = await permission.Panel.CSV.init(db);

  permRole.RolePermission = {perm: 'crud'};
  permDivision.RolePermission = {perm: 'crud'};
  permUser.RolePermission = {perm: 'crud'};
  permSchedule.RolePermission = {perm: 'crud'};
  permConfig.RolePermission = {perm: 'ru'};
  permPermission.RolePermission = {perm: 'r'};
  permCSV.RolePermission = {perm: 'r'};
  
  var permission_list = [
    // CRUD PANEL
    permRole,
    permDivision,
    permUser,
    permSchedule,
    permConfig,
    permPermission,
    permCSV
  ];
  
  await role.setPermissions(permission_list, {through: {perm: 'crud'}});

  // defining default user 'admin'
  var admin = await User.create({
    name: 'Administrator',
    username: 'admin',
    password: crypto.createHash('sha512').update('admin').digest('hex'),
    roleId: role.id
  });
}