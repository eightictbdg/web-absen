const Sequelize = require('sequelize');
const crypto = require('crypto');
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


const User = UserModel(sequelize, Sequelize);
const Division = DivisionModel(sequelize, Sequelize);
const Schedule = ScheduleModel(sequelize, Sequelize);
const Role = RoleModel(sequelize, Sequelize);

User.hasMany(Schedule, {as: 'Absen'});
User.belongsTo(Division);
Division.hasMany(User, {as: 'User'});
User.belongsTo(Role);
Role.hasMany(User, {as: 'User'});

sequelize.sync({ force: env == 'development' })
  .then(function() {
    console.log(`Database & tables synched!`);
    User.count().then( function(count) {
      if (count == 0) {
        var admin = User.build({
          name: 'Administrator',
          username: 'admin',
          password: crypto.createHash('sha512').update('admin').digest('hex')
        });
        admin.save();
      }
    });
  });

module.exports = {
  User,
  Division,
  Schedule,
  Role
}