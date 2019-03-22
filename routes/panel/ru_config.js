const express = require('express');
const asyncHandler = require('express-async-handler')
const csv = require('csv-express')

const table_get_url = '/panel/config';
const update_post_url = '/panel/config';

const table_get_url_regex = '^\/panel\/config$';
const update_post_url_regex = '^\/panel\/config$';

function sub(router, db) {
  var config_form = require('../../forms/config');

  var permission = db.instances.permissions.Panel.Config;

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

  router.use('/panel/config', function IsAuthorizedMiddleware(req, res, next) {
    var perm = res.locals.rolePerms.find(obj => obj.name === permission.name);
    if (perm) {
      if (RegExp(table_get_url_regex).test(req.originalUrl) && req.method === 'GET') {
        if (perm.RolePermission.perm.includes('r')) next();
        else notAuthorized(req, res, next);
      }
      else if (RegExp(update_post_url_regex).test(req.originalUrl) && req.method === 'POST') {
        if (perm.RolePermission.perm.includes('u')) next();
        else notAuthorized(req, res, next);
      }
      else unknownURL(req, res, next);
    }
    else notAuthorized(req, res, next);
  });

  /* GET config table page */
  router.get(table_get_url, asyncHandler(async function config_table_get(req, res, next) {
    var form = config_form;
    var roles = await db.Role.findAll();
    var default_role = (await db.Config.findOne({where: {name: 'default_role'}}));
    config_form.fields.default_role.choices = [[0,'-']];
    roles.forEach(function (role) {config_form.fields.default_role.choices.push([role.id,role.name])});
    config_form.fields.default_role.value = default_role.value;
    res.render('boilerplate_panel', {_template: 'panel/config/table', form: form});
  }));

  /* POST create config page */
  router.post(update_post_url, asyncHandler(async function edit_config_post(req, res, next) {
    config_form.handle(req, {
      success: async function (form) {
        if (await db.Role.findByPk(form.data.default_role)) {
          var default_role = (await db.Config.findOne({where: {name: 'default_role'}}));
          default_role.value = form.data.default_role;
          default_role.save();
          req.flash('info','Success!');
          req.session.save(function() {
            res.redirect(table_get_url);
          });
        }
        else {
          req.flash('error','Invalid Default Role!');
          req.session.save(function() {
            res.redirect(req.url);
          });
        }
      },
      other: async function (form) {
        var roles = await db.Role.findAll();
        var default_role = (await db.Config.findOne({where: {name: 'default_role'}}));
        config_form.fields.default_role.choices = [[0,'-']];
        roles.forEach(function (role) {config_form.fields.default_role.choices.push([role.id,role.name])});
        config_form.fields.default_role.value = default_role.value;
        res.render('boilerplate_panel', {_template: 'panel/config/table', form: form});
      }
    });
  }));
}

module.exports = sub;