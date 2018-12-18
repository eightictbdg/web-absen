const express = require('express');
const asyncHandler = require('express-async-handler')


function sub(router, db) {

  var role_form = require('../../../forms/role');
  var create_role_form = role_form();
  var edit_role_form = role_form();

  /* GET role table page */
  router.get('/panel/admin/role', asyncHandler(async function role_table_get(req, res, next) {
    var roles = await db.Role.findAll();
    res.render('role/table', {roles: roles, form: create_role_form});
  }));

  /* POST create role page */
  router.post('/panel/admin/role', asyncHandler(async function add_role_post(req, res, next) {
    create_role_form.handle(req, {
      success: async function (form) {
        var role = await db.Role.create({
          name: form.data.name
        });
        var roles = await db.Role.findAll();
        res.render('role/table', {roles: roles, form: create_role_form});
      },
      error: async function (form) {
        var roles = await db.Role.findAll();
        res.render('role/table', {roles: roles, form: form});
      },
      empty: async function (form) {
        var roles = await db.Role.findAll();
        res.render('role/table', {roles: roles, form: form});
      }
    });
  }));

  /* GET read role page */
  router.get('/panel/admin/role/:roleId', asyncHandler(async function add_role_post(req, res, next) {
    var role = await db.Role.findByPk(req.params.roleId);
    if (role) {
      res.render('role/read', { role: role });
    }
    else res.sendStatus(404);
  }));

  /* GET update role page */
  router.get('/panel/admin/role/:roleId/update', asyncHandler(async function add_role_post(req, res, next) {
    var role = await db.Role.findByPk(req.params.roleId);
    if (role) {
      edit_role_form.fields.name.value = role.name;
      res.render('role/edit', { role: role, form: edit_role_form });
    }
    else res.sendStatus(404);
  }));

  /* POST update role page */
  router.post('/panel/admin/role/:roleId/update', asyncHandler(async function add_role_post(req, res, next) {
    edit_role_form.handle(req, {
      success: async function (form) {
        var role = await db.Role.findByPk(req.params.roleId);
        if (role) {
          role.name = form.data.name;
          role.save();
          res.redirect('/panel/admin/role')
        }
        else res.sendStatus(404);
      },
      error: async function (form) {
        var role = await db.Role.findByPk(req.params.roleId);
        if (role) res.render('role/edit', { role: role, form: form });
        else res.sendStatus(404);
      },
      empty: async function (form) {
        var role = await db.Role.findByPk(req.params.roleId);
        if (role) res.render('role/edit', { role: role, form: form });
        else res.sendStatus(404);
      }
    });
  }));

  /* GET delete role page */
  router.get('/panel/admin/role/:roleId/delete', asyncHandler(async function add_role_post(req, res, next) {
    var role = await db.Role.findByPk(req.params.roleId);
    if (role) {
      role.destroy();
      res.redirect('/panel/admin/role')
    }
    else res.sendStatus(404);
  }));

}

module.exports = sub;