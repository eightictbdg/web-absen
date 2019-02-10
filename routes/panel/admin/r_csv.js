const express = require('express');
const asyncHandler = require('express-async-handler')
const Sequelize = require('sequelize');

function sub(router, db) {
  router.get('/panel/admin/csv', function(req, res, next) {
    res.render('boilerplate', {_template: 'admin/csv', currentUrl : req.url});
  })

  router.get('/panel/admin/csv/configs.csv', asyncHandler(async function(req, res, next) {
    var data = await db.Config.findAll({attributes: ['id','name','value']});
    var rows = JSON.parse(JSON.stringify(data));
    res.csv(rows, true);
  }));

  router.get('/panel/admin/csv/users.csv', asyncHandler(async function(req, res, next) {
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

  router.get('/panel/admin/csv/divisions.csv', asyncHandler(async function(req, res, next) {
    var data = await db.Division.findAll({attributes: ['id','name']});
    var rows = JSON.parse(JSON.stringify(data));
    res.csv(rows, true);
  }));

  router.get('/panel/admin/csv/roles.csv', asyncHandler(async function(req, res, next) {
    var data = await db.Role.findAll({attributes: ['id','name']});
    var rows = JSON.parse(JSON.stringify(data));
    res.csv(rows, true);
  }));

  router.get('/panel/admin/csv/schedules.csv', asyncHandler(async function(req, res, next) {
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