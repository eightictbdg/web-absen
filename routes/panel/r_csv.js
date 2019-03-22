const express = require('express');
const asyncHandler = require('express-async-handler')
const Sequelize = require('sequelize');

const read_csv_get = '/panel/csv';
const read_csv_configs_get = '/panel/csv/configs.csv';
const read_csv_users_get = '/panel/csv/users.csv';
const read_csv_divisions_get = '/panel/csv/divisions.csv';
const read_csv_roles_get = '/panel/csv/roles.csv';
const read_csv_schedules_get = '/panel/csv/schedules.csv';

function sub(router, db) {
  var csv_permission = db.instances.permissions.Panel.CSV;
  var division_permission = db.instances.permissions.Panel.Division;
  var config_permission = db.instances.permissions.Panel.Config;
  var user_permission = db.instances.permissions.Panel.User;
  var role_permission = db.instances.permissions.Panel.Role;
  var schedule_permission = db.instances.permissions.Panel.Schedule;

  function notAuthorized(req, res, next) {
    req.flash('error','Unauthorized Access!');
    req.session.save(function() {
      res.redirect('/');
    });
  }

  function unknownURL(req, res, next) {
    req.flash('error','Unknown URL! (' + req.originalUrl + ')')
    req.session.save(function() {
      res.redirect('/');
    });
  }

  router.use('/panel/csv', function IsAuthorizedMiddleware(req, res, next) {
    var csv_perm = res.locals.rolePerms.find(obj => obj.name === csv_permission.name);
    var role_perm = res.locals.rolePerms.find(obj => obj.name === role_permission.name);
    var division_perm = res.locals.rolePerms.find(obj => obj.name === division_permission.name);
    var config_perm = res.locals.rolePerms.find(obj => obj.name === config_permission.name);
    var user_perm = res.locals.rolePerms.find(obj => obj.name === user_permission.name);
    var schedule_perm = res.locals.rolePerms.find(obj => obj.name === schedule_permission.name);

    if (csv_perm && csv_perm.RolePermission.perm.includes('r')) {
      if (req.originalUrl === read_csv_get && req.method === 'GET') {
        next();
      }
      else if (req.originalUrl === read_csv_configs_get && req.method === 'GET') {
        if (config_perm && config_perm.RolePermission.perm.includes('r')) next();
        else notAuthorized(req, res, next);
      }
      else if (req.originalUrl === read_csv_users_get && req.method === 'GET') {
        if (user_perm && user_perm.RolePermission.perm.includes('r')) next();
        else notAuthorized(req, res, next);
      }
      else if (req.originalUrl === read_csv_divisions_get && req.method === 'GET') {
        if (division_perm && division_perm.RolePermission.perm.includes('r')) next();
        else notAuthorized(req, res, next);
      }
      else if (req.originalUrl === read_csv_roles_get && req.method === 'GET') {
        if (role_perm && role_perm.RolePermission.perm.includes('r')) next();
        else notAuthorized(req, res, next);
      }
      else if (req.originalUrl === read_csv_schedules_get && req.method === 'GET') {
        if (schedule_perm && schedule_perm.RolePermission.perm.includes('r')) next();
        else notAuthorized(req, res, next);
      }
      else unknownURL(req, res, next);
    }
    else notAuthorized(req, res, next);
  });

  router.get(read_csv_get, function(req, res, next) {
    res.render('boilerplate_panel', {_template: 'panel/csv'});
  })

  router.get(read_csv_configs_get, asyncHandler(async function(req, res, next) {
    var data = await db.Config.findAll({attributes: ['id','name','value']});
    var rows = JSON.parse(JSON.stringify(data));
    res.csv(rows, true);
  }));

  router.get(read_csv_users_get, asyncHandler(async function(req, res, next) {
    var data = await db.User.findAll({
      include: [{
        model: db.Division,
        as: 'division',
        attributes: []
      }, {
        model: db.Role,
        as: 'role',
        attributes: []
      }],
      attributes: [
        ['id','ID'],
        ['name','Nama'],
        ['class','Kelas'],
        ['username', 'Username'],
        [Sequelize.col('division.name'), 'Nama Divisi'],
        [Sequelize.col('role.name'), 'Peran']
      ]
    });
    var rows = JSON.parse(JSON.stringify(data));
    res.csv(rows, true);
  }));

  router.get(read_csv_divisions_get, asyncHandler(async function(req, res, next) {
    var data = await db.Division.findAll({attributes: ['id','name']});
    var rows = JSON.parse(JSON.stringify(data));
    res.csv(rows, true);
  }));

  router.get(read_csv_roles_get, asyncHandler(async function(req, res, next) {
    var data = await db.Role.findAll({attributes: ['id','name']});
    var rows = JSON.parse(JSON.stringify(data));
    res.csv(rows, true);
  }));

  router.get(read_csv_schedules_get, asyncHandler(async function(req, res, next) {
    var data = await db.Schedule.findAll({
      include: [{
        model: db.User,
        attributes: []
      }],
      attributes: [
        ['id', 'ID'],
        ['date','Waktu'],
        ['info','Keterangan'],
        ['passkey','Passkey'],
        [Sequelize.fn("COUNT", Sequelize.col("userId")), "Jumlah orang yang hadir"]
      ],
      group: ['schedule.id']
    });
    var rows = JSON.parse(JSON.stringify(data));
    res.csv(rows, true);
  }));
}

module.exports = sub;