var Role = require('./role');
var Division = require('./division');
var User = require('./user');
var Schedule = require('./schedule');
var Config = require('./config');
var Permission = require('./permission');
var Attend = require('./attend');
var CSV = require('./csv');

var instances = {
  Role,
  Division,
  User,
  Schedule,
  Config,
  Permission,
  Attend,
  CSV
};

module.exports = instances;