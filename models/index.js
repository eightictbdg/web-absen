const Sequelize = require('sequelize');
const crypto = require('crypto');
const fse = require('fs-extra');

const ConfigModel = require('./config');
const UserModel = require('./user');
const DivisionModel = require('./division');
const ScheduleModel = require('./schedule');
const RoleModel = require('./role');

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

// Relations
Schedule.belongsToMany(User, {through: 'UserSchedule'});
User.belongsToMany(Schedule, {through: 'UserSchedule'});
User.belongsTo(Division);
Division.hasMany(User, {as: 'User'});
User.belongsTo(Role);
Role.hasMany(User, {as: 'User'});

// Instances
var roles = require('./instances/roles');
var divisions = require('./instances/divisions');
var configs = require('./instances/configs');

var db = {
  Config,
  User,
  Division,
  Schedule,
  Role
}

db.instances = {
  roles,
  divisions,
  configs
}

async function sync() {
  await sequelize.sync({ force: env == 'development' });
  console.log(`Database & tables synched!`);

  for (var model in db.instances) {
    for (var instance in db.instances[model]){
      await db.instances[model][instance].init(db);
    }
  }
}

module.exports = {
  db,
  sync
}