const Sequelize = require('sequelize');
const crypto = require('crypto');
const fse = require('fs-extra');

const ConfigModel = require('./config');
const UserModel = require('./user');
const DivisionModel = require('./division');
const ScheduleModel = require('./schedule');
const RoleModel = require('./role');
const PermissionModel = require('./permission');

const env = process.env.NODE_ENV || 'development';

const config = require('../config.js')[env];

var database_dir = process.env.DATA_DIR ? process.env.DATA_DIR + '/database' : './database';

fse.ensureDirSync(database_dir);

var sequelize = new Sequelize(config.database, config.username, config.password, config);
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

var Config = ConfigModel(sequelize, Sequelize);
var User = UserModel(sequelize, Sequelize);
var Division = DivisionModel(sequelize, Sequelize);
var Schedule = ScheduleModel(sequelize, Sequelize);
var Role = RoleModel(sequelize, Sequelize);
var Permission = PermissionModel(sequelize, Sequelize);

var RolePermission = sequelize.define('RolePermission', {
    perm: Sequelize.STRING
})

// Relations
Schedule.belongsToMany(User, {through: 'UserSchedule'});
User.belongsToMany(Schedule, {through: 'UserSchedule'});
User.belongsTo(Division);
Division.hasMany(User, {as: 'User'});
User.belongsTo(Role);
Role.hasMany(User, {as: 'User'});
Role.belongsToMany(Permission, {through: RolePermission});
Permission.belongsToMany(Role, {through: RolePermission});

// Instances
var roles = require('./instances/roles');
var divisions = require('./instances/divisions');
var configs = require('./instances/configs');
var permissions = require('./instances/permissions');

var db = {
  Config,
  User,
  Division,
  Schedule,
  Role,
  Permission
}

db.instances = {
  roles,
  divisions,
  configs,
  permissions
}

async function sync() {
  await sequelize.sync({ force: env == 'development' });
  console.log(`Database & tables synched!`);

  for (var model_key in db.instances) {
    var model = db.instances[model_key];
    for (var instance_key in model){
      var instance = model[instance_key];
      await instance.init(db);
    }
  }
}

module.exports = {
  db,
  sync
}