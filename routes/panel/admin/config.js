const express = require('express');
const asyncHandler = require('express-async-handler')

function sub(router, db) {

  var config_form = require('../../../forms/config');

  /* GET config table page */
  router.get('/panel/admin/config', asyncHandler(async function config_table_get(req, res, next) {
    var roles = await db.Role.findAll();
    config_form.fields.default_role.choices = [[0,'-']];
    roles.forEach(function (role) { config_form.fields.default_role.choices.push([role.id,role.name]) });
    res.render('boilerplate', { _template: 'config/table', form: config_form });
  }));

  /* POST create config page */
  router.post('/panel/admin/config', asyncHandler(async function edit_config_post(req, res, next) {
    config_form.handle(req, {
      success: async function (form) {
        var default_role = db.Config.findOrCreate({where: {name: 'default_role'}, defaults: {value: 0}})[0];
        default_role.value = form.data.default_role;
        default_role.save();
        req.flash('info','Success!')
        res.redirect('/panel/admin/config')
      },
      other: async function (form) {
        var roles = await db.Role.findAll();
        config_form.fields.default_role.choices = [[0,'-']];
        roles.forEach(function (role) { config_form.fields.default_role.choices.push([role.id,role.name]) });
        res.render('boilerplate', { _template: 'config/table', form: form });
      }
    });
  }));
