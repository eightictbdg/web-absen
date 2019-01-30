const Sequelize = require('sequelize');
const crypto = require('crypto');
const ConfigModel = require('./models/config');
const UserModel = require('./models/user');
const DivisionModel = require('./models/division');
const ScheduleModel = require('./models/schedule');
const RoleModel = require('./models/role');

const env = process.env.NODE_ENV || 'development';
const config = require('./config.js')[env];

var sequelize = new Sequelize(config.database, config.username, config.password, config);
sequelize
  .authenticate()
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

Schedule.belongsToMany(User, {through: 'UserSchedule'});
User.belongsToMany(Schedule, {through: 'UserSchedule'});
User.belongsTo(Division);
Division.hasMany(User, {as: 'User'});
User.belongsTo(Role);
Role.hasMany(User, {as: 'User'});

sequelize.sync({ force: env == 'development' })
  .then(async function() {
    console.log(`Database & tables synched!`);
    var db = {
      Config,
      User,
      Division,
      Schedule,
      Role
    }

    // Role
    var Admin = await require('./instances/admin')(db);
    var Manager = await require('./instances/manager')(db);
    var Member = await require('./instances/member')(db);
    var Initiate = await require('./instances/initiate')(db);

    // Config
    var DefaultRole = await require('./instances/config/default_role')(db);

    var instances = {
      Admin,
      Manager,
      Member,
      Initiate,
      DefaultRole
    }

    db.instances = instances;

    module.exports = db
  });