const express = require('express');
const asyncHandler = require('express-async-handler')
const datetime = require('node-datetime');

function sub(router, db) {

  var attend_form = require('../../forms/attend');

  // Check if user has the right role
  router.use('/panel/initiate', asyncHandler(async function isMemberMiddleware(req, res, next) {
    if (req.session.logged_in) {
      var user = await db.User.findByPk(req.session.user_id);
      if (!user) res.redirect('/logout')
      var role = await user.getRole();
      if (role.name == 'Calon Anggota') { next(); }
      else res.redirect('/');
    }
    else res.redirect('/');
  }));
  
  /* GET initiate panel page. */
  router.get('/panel/initiate', asyncHandler(async function admin_panel_get(req, res, next) {
    var date = datetime.create();
    var formatted = date.format('Y-m-d');
    var schedules = await db.Schedule.findAll({ where: { date: formatted } });
    if (schedules.length !== 0) {
      var user = await db.User.findByPk(req.session.user_id);
      user.schedules = await user.hasSchedules();
      if (!(await user.hasSchedules(schedules))) {
        res.render('boilerplate', { _template: 'panel_member', title: 'Initiate Panel', form: attend_form, schedules: schedules });
      }
      else res.render('boilerplate', { _template: 'panel_member', title: 'Initiate Panel', message: "There's no unattended schedule for today" });
    }
    else res.render('boilerplate', { _template: 'panel_member', title: 'Initiate Panel', message: "There's no schedule for today" });
  }));

  /* POST initiate panel page. */  
  router.post('/panel/initiate', asyncHandler(async function login_post(req, res, next) {
    attend_form.handle(req, {
      success: async function (form) {
        var schedules = await db.Schedule.findAll({ where: {date: datetime.create().format('Y-m-d')} });
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
        res.redirect('/panel/initiate');
      },
      other: function (form) {
        res.render('boilerplate', { _template: 'panel_member', title: 'Initiate Panel', form: form });
      }
    });
  }));
}

module.exports = sub;