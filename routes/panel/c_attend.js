const express = require('express');
const asyncHandler = require('express-async-handler')
const datetime = require('node-datetime');

const create_get_url = '/panel/attend';
const create_post_url = '/panel/attend';

function sub(router, db) {
  var attend_form = require('../../forms/attend');

  var permission = db.instances.permissions.Panel.Attend;

  router.use('/panel/csv', function IsAuthorizedMiddleware(req, res, next) {
    var perm = res.locals.rolePerms.find(obj => obj.name === permission.name);
    if (perm) {
      if (req.originalUrl === create_get_url && req.method === 'GET') {
        if (perm.RolePermission.perm.includes('c')) next();
        else notAuthorized(req, res, next);
      }
      else if (req.originalUrl === create_post_url && req.method === 'POST') {
        if (perm.RolePermission.perm.includes('c')) next();
        else notAuthorized(req, res, next);
      }
      else unknownURL(req, res, next);
    }
    else notAuthorized(req, res, next);
  });

  /* GET attend create page. */
  router.get(create_get_url, asyncHandler(async function attend_get(req, res, next) {
    var date = datetime.create();
    var formatted = date.format('Y-m-d');
    var schedules = await db.Schedule.findAll({where: {date: formatted}});
    if (schedules.length !== 0) {
      var user = await db.User.findByPk(req.session.user_id);
      user.schedules = await user.hasSchedules();
      if (!(await user.hasSchedules(schedules))) {
        res.render('boilerplate_panel', {_template: 'panel/attend', form: attend_form});
      }
      else res.render('boilerplate_panel', {_template: 'panel/attend', message: "There's no unattended schedule for today"});
    }
    else res.render('boilerplate_panel', {_template: 'panel/attend', message: "There's no schedule for today"});
  }));

  /* POST attend create page. */  
  router.post(create_post_url, asyncHandler(async function attend_post(req, res, next) {
    attend_form.handle(req, {
      success: async function (form) {
        var schedules = await db.Schedule.findAll({where: {date: datetime.create().format('Y-m-d')}});
        if (schedules) {
          var schedule = schedules.filter(x => x.passkey == form.data.passkey)
          if (schedule.length !== 0){
            var user = await db.User.findByPk(req.session.user_id);
            if (!(await user.hasSchedules(schedule))) {
              await user.addSchedule(schedule);
              req.flash('info', 'Success!');
            }
            else req.flash('error', 'That schedule has been attended');
          }
          else req.flash('error', 'Wrong passkey');
        }
        req.session.save(function() {
          res.redirect(create_get_url);
        })
      },
      other: function (form) {
        res.render('boilerplate_panel', {_template: 'panel/attend', form: form});
      }
    });
  }));
}

module.exports = sub; 
