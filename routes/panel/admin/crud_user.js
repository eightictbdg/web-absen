const express = require('express');
const crypto = require('crypto');
const asyncHandler = require('express-async-handler')


function sub(router, db) {

  var create_user_form = require('../../../forms/user/create')();
  var edit_user_form = require('../../../forms/user/edit')();

  /* GET user table page */
  router.get('/panel/admin/user', asyncHandler(async function user_table_get(req, res, next) {
    var users = await db.User.findAll({include: [{ model: db.Division, as: 'division' }, { model: db.Role, as: 'role' }]});
    var divisions = await db.Division.findAll();
    var roles = await db.Role.findAll();
    create_user_form.fields.division.choices = [[0,'-']];
    create_user_form.fields.role.choices = [];
    divisions.forEach(function (division) { create_user_form.fields.division.choices.push([division.id,division.name]) });
    roles.forEach(function (role) { create_user_form.fields.role.choices.push([role.id,role.name]) });
    res.render('boilerplate', { _template: 'admin/user/table', users: users, form: create_user_form, currentUrl: req.url });
  }));

  /* POST create user page */
  router.post('/panel/admin/user', asyncHandler(async function add_user_post(req, res, next) {
    create_user_form.handle(req, {
      success: async function (form) {
        if (!await db.Role.findByPk(form.data.role)) res.status(422).send('Invalid Role ID')
        var user = await db.User.create({
          name: form.data.name,
          username: form.data.username,
          class: form.data.class,
          divisionId: await db.Division.findByPk(form.data.division) ? form.data.division : null,
          roleId: form.data.role,
          password: crypto.createHash('sha512').update(form.data.password).digest('hex')
        });
        res.redirect('/panel/admin/user')
      },
      other: async function (form) {
        var users = await db.User.findAll({include: [{ model: db.Division, as: 'division' }, { model: db.Role, as: 'role' }]});
        var divisions = await db.Division.findAll();
        var roles = await db.Role.findAll();
        form.fields.division.choices = [[0,'-']];
        form.fields.role.choices = [];
        divisions.forEach(function (division) { form.fields.division.choices.push([division.id,division.name]) });
        roles.forEach(function (role) { form.fields.role.choices.push([role.id,role.name]) });
        res.render('boilerplate', { _template: 'admin/user/table', users: users, form: form, currentUrl: req.url });
      }
    });
  }));

  /* GET read user page */
  router.get('/panel/admin/user/:userId', asyncHandler(async function read_user_get(req, res, next) {
    var user = await db.User.findByPk(req.params.userId);
    if (user) {
      user.division = await user.getDivision();
      user.role = await user.getRole();
      res.render('boilerplate', { _template: 'admin/user/read', user: user });
    }
    else res.sendStatus(404);
  }));

  /* GET update user page */
  router.get('/panel/admin/user/:userId/update', asyncHandler(async function update_user_get(req, res, next) {
    var user = await db.User.findByPk(req.params.userId);
    if (user) {
      var divisions = await db.Division.findAll();
      var roles = await db.Role.findAll();
      edit_user_form.fields.division.choices = [[0,'-']];
      edit_user_form.fields.role.choices = [];
      divisions.forEach(function (division) { edit_user_form.fields.division.choices.push([division.id,division.name]) });
      roles.forEach(function (role) { edit_user_form.fields.role.choices.push([role.id,role.name]) });
      user.division = await user.getDivision();
      user.role = await user.getRole();
      edit_user_form.fields.division.value = user.division ? user.division.id : 0;
      edit_user_form.fields.role.value = user.role.id;
      edit_user_form.fields.name.value = user.name;
      edit_user_form.fields.username.value = user.username;
      edit_user_form.fields.class.value = user.class;
      res.render('boilerplate', {_template: 'admin/user/edit', user: user, form: edit_user_form });
    }
    else res.sendStatus(404);
  }));

  /* POST update user page */
  router.post('/panel/admin/user/:userId/update', asyncHandler(async function update_user_post(req, res, next) {
    edit_user_form.handle(req, {
      success: async function (form) {
        var user = await db.User.findByPk(req.params.userId);
        if (user) {
          if (!await db.Role.findByPk(form.data.role)) res.status(422).send('Invalid Role ID')
          user.name = form.data.name;
          user.username = form.data.username;
          user.class = form.data.class;
          user.divisionId = await db.Division.findByPk(form.data.division) ? form.data.division : null,
          user.roleId = form.data.role;
          user.password = form.data.password ? crypto.createHash('sha512').update(form.data.password).digest('hex') : user.password;
          user.save();
          req.flash('info','Success!')
          res.redirect('/panel/admin/user')
        }
        else res.sendStatus(404);
      },
      other: async function (form) {
        var user = await db.User.findByPk(req.params.userId);
        if (user) res.render('boilerplate', {_template: 'admin/user/edit', user: user, form: form });
        else res.sendStatus(404);
      }
    });
  }));

  /* GET delete user page */
  router.get('/panel/admin/user/:userId/delete', asyncHandler(async function delete_user_get(req, res, next) {
    var user = await db.User.findByPk(req.params.userId);
    if (user) {
      await user.destroy();
      req.flash('info','Success!')
      res.redirect('/panel/admin/user')
    }
    else res.sendStatus(404);
  }));

}

module.exports = sub;