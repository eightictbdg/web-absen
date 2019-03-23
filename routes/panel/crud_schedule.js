const express = require('express');
const asyncHandler = require('express-async-handler');
const Sequelize = require('sequelize');

const table_get_url = '/panel/schedule';
const create_post_url = '/panel/schedule';
const read_get_url = '/panel/schedule/:scheduleId/read';
const read_csv_get_url = '/panel/schedule/:scheduleId/read/users.csv';
const update_get_url = '/panel/schedule/:scheduleId/update';
const update_post_url = '/panel/schedule/:scheduleId/update';
const delete_get_url = '/panel/schedule/:scheduleId/delete';

const read_get_url_regex = '^\/panel\/schedule\/[0-9]*\/read$';
const read_csv_get_url_regex = '^\/panel\/schedule\/[0-9]*\/read/users.csv$';
const update_get_url_regex = '^\/panel\/schedule\/[0-9]*\/update$';
const update_post_url_regex = '^\/panel\/schedule\/[0-9]*\/update$';
const delete_get_url_regex = '^\/panel\/schedule\/[0-9]*\/delete$';

function sub(router, db) {
  var schedule_form = require('../../forms/schedule');
  var create_schedule_form = schedule_form();
  var edit_schedule_form = schedule_form();

  var permission = db.instances.permissions.Panel.Schedule;

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

  router.use('/panel/schedule', function IsAuthorizedMiddleware(req, res, next) {
    var perm = res.locals.rolePerms.find(obj => obj.name === permission.name);
    if (perm) {
      if (
        (
          req.originalUrl === table_get_url ||
          RegExp(read_get_url_regex).test(req.originalUrl) ||
          RegExp(read_csv_get_url_regex).test(req.originalUrl)
        ) && req.method === 'GET') {
        if (perm.RolePermission.perm.includes('r')) next();
        else notAuthorized(req, res, next);
      }
      else if (req.originalUrl === create_post_url  && req.method === 'POST') {
        if (perm.RolePermission.perm.includes('c')) next();
        else notAuthorized(req, res, next);
      }
      else if ((RegExp(update_get_url_regex).test(req.originalUrl) && req.method === 'GET') || (RegExp(update_post_url_regex).test(req.originalUrl) && req.method === 'POST')) {
        if (perm.RolePermission.perm.includes('u')) next();
        else notAuthorized(req, res, next);
      }
      else if (RegExp(delete_get_url_regex).test(req.originalUrl) && req.method === 'GET') {
        if (perm.RolePermission.perm.includes('d')) next();
        else notAuthorized(req, res, next);
      }
      else unknownURL(req, res, next);
    }
    else notAuthorized(req, res, next);
  });

  /* GET schedule table page */
  router.get(table_get_url, asyncHandler(async function schedule_table_get(req, res, next) {
    var form = create_schedule_form;
    var perm = res.locals.rolePerms.find(obj => obj.name === 'panel_schedule');
    if (!(perm.RolePermission.perm.includes('c'))) {form = null;}
    var schedules = await db.Schedule.findAll();
    res.render('boilerplate_panel', {
      _template: 'panel/schedule/table', 
      schedules: schedules, 
      form: form
    });
  }));

  /* POST create schedule page */
  router.post(create_post_url, asyncHandler(async function add_schedule_post(req, res, next) {
    create_schedule_form.handle(req, {
      success: async function (form) {
        if (await db.Schedule.findOne({where: {date: form.data.date, passkey: form.data.passkey}})) {
          req.flash('error','A schedule at the same date with the same passkey already exists.');
          req.session.save(function() {
            res.redirect(table_get_url)
          });
        }
        else {
          var schedule = await db.Schedule.create({
            date: form.data.date,
            info: form.data.info,
            passkey: form.data.passkey
          });
          req.flash('info','Success!');
          req.session.save(function() {
            res.redirect(table_get_url)
          });
        }
      },
      other: async function (form) {
        var schedules = await db.Schedule.findAll();
        res.render('boilerplate_panel', {
          _template: 'panel/schedule/table',
          schedules: schedules,
          form: form
        });
      }
    });
  }));

  /* GET read schedule page */
  router.get(read_get_url, asyncHandler(async function read_schedule_get(req, res, next) {
    var schedule = await db.Schedule.findByPk(req.params.scheduleId);
    if (schedule) {
      var users = await schedule.getUsers();
      res.render('boilerplate_panel', {
        _template: 'panel/schedule/read',
        schedule: schedule,
        users: users
      });
    }
    else res.sendStatus(404);
  }));

  router.get(read_csv_get_url, asyncHandler(async function read_schedule_csv_get(req, res, next) {
    var schedule = await db.Schedule.findByPk(req.params.scheduleId);
    if (schedule) {
      var users = await schedule.getUsers({
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
          [Sequelize.col('role.name'), 'Peran'],
          [Sequelize.col('UserSchedule.createdAt'), 'Absen Pada Waktu [UTC]']
        ],
        joinTableAttributes: [],
        raw: true
      });
      var rows = JSON.parse(JSON.stringify(users));
      res.csv(rows, true);
    }
    else res.sendStatus(404);
  }));

  /* GET update schedule page */
  router.get(update_get_url, asyncHandler(async function update_schedule_get(req, res, next) {
    var form = edit_schedule_form;
    var schedule = await db.Schedule.findByPk(req.params.scheduleId);
    if (schedule) {
      form.fields.date.value = schedule.date;
      form.fields.info.value = schedule.info;
      form.fields.passkey.value = schedule.passkey;
      res.render('boilerplate_panel', {
        _template: 'panel/schedule/edit',
        schedule: schedule,
        form: form
      });
    }
    else res.sendStatus(404);
  }));

  /* POST update schedule page */
  router.post(update_post_url, asyncHandler(async function update_schedule_post(req, res, next) {
    edit_schedule_form.handle(req, {
      success: async function (form) {
        var schedule = await db.Schedule.findByPk(req.params.scheduleId);
        if (schedule) {
          if ((schedule.date === form.data.date && schedule.passkey === form.data.passkey) ||
            !(await db.Schedule.findOne({where: {date: form.data.date, passkey: form.data.passkey}}))
          ) {
            schedule.date = form.data.date;
            schedule.info = form.data.info;
            schedule.passkey = form.data.passkey;
            schedule.save();
            req.flash('info','Success!');
            req.session.save(function() {
              res.redirect(table_get_url);
            });
          }
          else {
            req.flash('error','A schedule at the same date with the same passkey already exists.');
            req.session.save(function() {
              res.redirect(req.url);
            });
          }
        }
        else res.sendStatus(404);
      },
      other: async function (form) {
        var schedule = await db.Schedule.findByPk(req.params.scheduleId);
        if (schedule) {
          form.fields.date.value = schedule.date;
          form.fields.info.value = schedule.info;
          form.fields.passkey.value = schedule.passkey;
          res.render('boilerplate_panel', {
            _template: 'panel/schedule/edit',
            schedule: schedule,
            form: form
          });
        }
        else res.sendStatus(404);
      }
    });
  }));

  /* GET delete schedule page */
  router.get(delete_get_url, asyncHandler(async function delete_schedule_get(req, res, next) {
    var schedule = await db.Schedule.findByPk(req.params.scheduleId);
    if (schedule) {
      await schedule.destroy();
      req.flash('info','Success!');
      req.session.save(function() {
        res.redirect(table_get_url)
      });
    }
    else res.sendStatus(404);
  }));

}

module.exports = sub;