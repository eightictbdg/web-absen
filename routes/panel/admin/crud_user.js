const express = require('express');
const crypto = require('crypto');
const asyncHandler = require('express-async-handler')


function sub(router, db) {

  var create_user_form = require('../../../forms/user/create')();
  var edit_user_form = require('../../../forms/user/edit')();

  /* GET user table page */
  router.get('/panel/admin/user', asyncHandler(async function user_table_get(req, res, next) {
    var users = await db.User.findAll();
    res.render('user/table', {users: users, form: create_user_form});
  }));

  /* POST create user page */
  router.post('/panel/admin/user', asyncHandler(async function add_user_post(req, res, next) {
    create_user_form.handle(req, {
      success: async function (form) {
        var user = await await db.User.create({
          name: form.data.name,
          username: form.data.username,
          class: form.data.class,
          password: crypto.createHash('sha512').update(form.data.password).digest('hex')
        });
        var users = await db.User.findAll();
        res.render('user/table', {users: users, form: create_user_form});
      },
      error: async function (form) {
        var users = await db.User.findAll();
        res.render('user/table', {users: users, form: form});
      },
      empty: async function (form) {
        var users = await db.User.findAll();
        res.render('user/table', {users: users, form: form});
      }
    });
  }));

  /* GET read user page */
  router.get('/panel/admin/user/:userId', asyncHandler(async function add_user_post(req, res, next) {
    var user = await db.User.findByPk(req.params.userId);
    if (user) {
      res.render('user/read', { user: user });
    }
    else res.sendStatus(404);
  }));

  /* GET update user page */
  router.get('/panel/admin/user/:userId/update', asyncHandler(async function add_user_post(req, res, next) {
    var user = await db.User.findByPk(req.params.userId);
    if (user) {
      edit_user_form.fields.name.value = user.name;
      edit_user_form.fields.username.value = user.username;
      edit_user_form.fields.class.value = user.class;
      res.render('user/edit', { user: user, form: edit_user_form });
    }
    else res.sendStatus(404);
  }));

  /* POST update user page */
  router.post('/panel/admin/user/:userId/update', asyncHandler(async function add_user_post(req, res, next) {
    edit_user_form.handle(req, {
      success: async function (form) {
        var user = await db.User.findByPk(req.params.userId);
        if (user) {
          user.name = form.data.name;
          user.username = form.data.username;
          user.class = form.data.class;
          user.password = form.data.password ? crypto.createHash('sha512').update(form.data.password).digest('hex') : user.password;
          user.save();
          res.redirect('/panel/admin/user')
        }
        else res.sendStatus(404);
      },
      error: async function (form) {
        var user = await db.User.findByPk(req.params.userId);
        if (user) res.render('user/edit', { user: user, form: form });
        else res.sendStatus(404);
      },
      empty: async function (form) {
        var user = await db.User.findByPk(req.params.userId);
        if (user) res.render('user/edit', { user: user, form: form });
        else res.sendStatus(404);
      }
    });
  }));

  /* GET delete user page */
  router.get('/panel/admin/user/:userId/delete', asyncHandler(async function add_user_post(req, res, next) {
    var user = await db.User.findByPk(req.params.userId);
    if (user) {
      user.destroy();
      res.redirect('/panel/admin/user')
    }
    else res.sendStatus(404);
  }));

}

module.exports = sub;