const crypto = require('crypto');

module.exports.name = 'Pengurus';

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
  var permAttend = await permission.Panel.Attend.init(db);
  var permCSV = await permission.Panel.CSV.init(db);

  permRole.RolePermission = {perm: 'r'};
  permDivision.RolePermission = {perm: 'r'};
  permUser.RolePermission = {perm: 'r'};
  permSchedule.RolePermission = {perm: 'r'};
  permConfig.RolePermission = {perm: 'r'};
  permPermission.RolePermission = {perm: 'r'};
  permAttend.RolePermission = {perm: 'c'};
  permCSV.RolePermission = {perm: 'r'};
  
  var permission_list = [
    permRole,
    permDivision,
    permUser,
    permSchedule,
    permConfig,
    permPermission,
    permAttend,
    permCSV
  ];
  
  await role.setPermissions(permission_list, {through: {perm: 'r'}});
}