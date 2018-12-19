const express = require('express');
const asyncHandler = require('express-async-handler')


function sub(router, db) {

  var schedule_form = require('../../../forms/schedule');
  var create_schedule_form = schedule_form();
  var edit_schedule_form = schedule_form();

  /* GET schedule table page */
  router.get('/panel/admin/schedule', asyncHandler(async function schedule_table_get(req, res, next) {
    var schedules = await db.Schedule.findAll();
    res.render('boilerplate', { _template: 'schedule/table', schedules: schedules, form: create_schedule_form });
  }));

  /* POST create schedule page */
  router.post('/panel/admin/schedule', asyncHandler(async function add_schedule_post(req, res, next) {
    create_schedule_form.handle(req, {
      success: async function (form) {
        if (await db.Schedule.findOne({ where: { date: form.data.date,passkey: form.data.passkey } })) {
          req.flash('error','A schedule at the same date with the same passkey already exists.')
          res.redirect('/panel/admin/schedule')
        }
        else {
          var schedule = await db.Schedule.create({
            date: form.data.date,
            info: form.data.info,
            passkey: form.data.passkey
          });
          req.flash('info','Success!')
          res.redirect('/panel/admin/schedule')
        }
      },
      other: async function (form) {
        var schedules = await db.Schedule.findAll();
        res.render('boilerplate', { _template: 'schedule/table', schedules: schedules, form: form });
      }
    });
  }));

  /* GET read schedule page */
  router.get('/panel/admin/schedule/:scheduleId', asyncHandler(async function read_schedule_get(req, res, next) {
    var schedule = await db.Schedule.findByPk(req.params.scheduleId);
    if (schedule) {
      res.render('boilerplate', { _template: 'schedule/read', schedule: schedule });
    }
    else res.sendStatus(404);
  }));

  /* GET update schedule page */
  router.get('/panel/admin/schedule/:scheduleId/update', asyncHandler(async function update_schedule_get(req, res, next) {
    var schedule = await db.Schedule.findByPk(req.params.scheduleId);
    if (schedule) {
      edit_schedule_form.fields.date.value = schedule.date;
      edit_schedule_form.fields.info.value = schedule.info;
      edit_schedule_form.fields.passkey.value = schedule.passkey;
      req.flash('info','Success!')
      res.redirect('/panel/admin/schedule/' + req.params.scheduleId)
    }
    else res.sendStatus(404);
  }));

  /* POST update schedule page */
  router.post('/panel/admin/schedule/:scheduleId/update', asyncHandler(async function update_schedule_post(req, res, next) {
    edit_schedule_form.handle(req, {
      success: async function (form) {
        var schedule = await db.Schedule.findByPk(req.params.scheduleId);
        if (schedule) {
          schedule.date = form.data.date;
          schedule.info = form.data.info;
          schedule.passkey = form.data.passkey;
          schedule.save();
          req.flash('info','Success!')
          res.redirect('/panel/admin/schedule')
        }
        else res.sendStatus(404);
      },
      other: async function (form) {
        var schedule = await db.Schedule.findByPk(req.params.scheduleId);
        if (schedule) res.render('schedule/edit', { schedule: schedule, form: form });
        else res.sendStatus(404);
      }
    });
  }));

  /* GET delete schedule page */
  router.get('/panel/admin/schedule/:scheduleId/delete', asyncHandler(async function delete_schedule_get(req, res, next) {
    var schedule = await db.Schedule.findByPk(req.params.scheduleId);
    if (schedule) {
      await schedule.destroy();
      req.flash('info','Success!')
      res.redirect('/panel/admin/schedule')
    }
    else res.sendStatus(404);
  }));

}

module.exports = sub;