const express = require('express');
const crypto = require('crypto');
const asyncHandler = require('express-async-handler')

const table_get_url = '/panel/user';
const create_post_url = '/panel/user';
const read_get_url = '/panel/user/:userId/read';
const update_get_url = '/panel/user/:userId/update';
const update_post_url = '/panel/user/:userId/update';
const delete_get_url = '/panel/user/:userId/delete';

const read_get_url_regex = '^\/panel\/user\/[0-9]*\/read$';
const update_get_url_regex = '^\/panel\/user\/[0-9]*\/update$';
const update_post_url_regex = '^\/panel\/user\/[0-9]*\/update$';
const delete_get_url_regex = '^\/panel\/user\/[0-9]*\/delete$';

function sub(router, db) {
  var create_user_form = require('../../forms/user/create')();
  var edit_user_form = require('../../forms/user/edit')();

  var permission = db.instances.permissions.Panel.User;

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

  router.use('/panel/user', function IsAuthorizedMiddleware(req, res, next) {
    var perm = res.locals.rolePerms.find(obj => obj.name === permission.name);
    if (perm) {
      if ((req.originalUrl === table_get_url || RegExp(read_get_url_regex).test(req.originalUrl)) && req.method === 'GET') {
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

  /* GET user table page */
  router.get(table_get_url, asyncHandler(async function user_table_get(req, res, next) {
    var form = create_user_form;
    var users = await db.User.findAll({include: [{model: db.Division, as: 'division'}, {model: db.Role, as: 'role'}]});
    var divisions = await db.Division.findAll();
    var roles = await db.Role.findAll();
    var perm = res.locals.rolePerms.find(obj => obj.name === 'panel_user');
    if (perm.RolePermission.perm.includes('c')) {
      form.fields.division.choices = [[0,'-']];
      form.fields.role.choices = [];
      divisions.forEach(function (division) {form.fields.division.choices.push([division.id,division.name])});
      roles.forEach(function (role) {form.fields.role.choices.push([role.id,role.name])});
    } 
    else {form = null;}
    res.render('boilerplate_panel', {
      _template: 'panel/user/table',
      users: users,
      form: form
    });
  }));

  /* POST create user page */
  router.post(create_post_url, asyncHandler(async function add_user_post(req, res, next) {
    create_user_form.handle(req, {
      success: async function (form) {
        if (!(await db.User.findOne({where: {username: form.data.username}}))) {
          if (await db.Role.findByPk(form.data.role)) {
            if (form.data.role != (await db.instances.roles.Admin.get(db)).id ||
                (form.data.role == (await db.instances.roles.Admin.get(db)).id && 
                (await db.instances.configs.CDAdmin.get(db)).value == 1))
            {
              var user = await db.User.create({
                name: form.data.name,
                username: form.data.username,
                class: form.data.class,
                divisionId: await db.Division.findByPk(form.data.division) ? form.data.division : null,
                roleId: form.data.role,
                password: crypto.createHash('sha512').update(form.data.password).digest('hex')
              });
              req.flash('info', 'Success!');
              req.session.save(function() {
                res.redirect(table_get_url);
              });
            }
            else {
              req.flash('error', 'Cannot create an Administrator!');
              req.session.save(function() {
                res.redirect(table_get_url);
              });
            }
          }
          else {
            req.flash('error', 'Invalid Role!');
            req.session.save(function() {
              res.redirect(table_get_url);
            });
          }
        }
        else {
          req.flash('error', 'User with the same username already exists!');
          req.session.save(function() {
            res.redirect(table_get_url);
          });
        }
      },
      other: async function (form) {
        var users = await db.User.findAll({include: [{model: db.Division, as: 'division'}, {model: db.Role, as: 'role'}]});
        var divisions = await db.Division.findAll();
        var roles = await db.Role.findAll();
        form.fields.division.choices = [[0,'-']];
        form.fields.role.choices = [];
        divisions.forEach(function (division) {form.fields.division.choices.push([division.id,division.name])});
        roles.forEach(function (role) {form.fields.role.choices.push([role.id,role.name])});
        res.render('boilerplate_panel', {
          _template: 'panel/user/table',
          users: users,
          form: form
        });
      }
    });
  }));

  /* GET read user page */
  router.get(read_get_url, asyncHandler(async function read_user_get(req, res, next) {
    var user = await db.User.findByPk(req.params.userId);
    if (user) {
      user.division = await user.getDivision();
      user.role = await user.getRole();
      res.render('boilerplate_panel', {_template: 'panel/user/read', user: user});
    }
    else res.sendStatus(404);
  }));

  /* GET update user page */
  router.get(update_get_url, asyncHandler(async function update_user_get(req, res, next) {
    var form = edit_user_form;
    var user = await db.User.findByPk(req.params.userId);
    if (user) {
      var divisions = await db.Division.findAll();
      var roles = await db.Role.findAll();
      form.fields.division.choices = [[0,'-']];
      form.fields.role.choices = [];
      divisions.forEach(function (division) { form.fields.division.choices.push([division.id,division.name]) });
      roles.forEach(function (role) { form.fields.role.choices.push([role.id,role.name]) });
      user.division = await user.getDivision();
      user.role = await user.getRole();
      form.fields.division.value = user.division ? user.division.id : 0;
      form.fields.role.value = user.role.id;
      form.fields.name.value = user.name;
      form.fields.username.value = user.username;
      form.fields.class.value = user.class;
      res.render('boilerplate_panel', {_template: 'panel/user/edit', user: user, form: form});
    }
    else res.sendStatus(404);
  }));

  /* POST update user page */
  router.post(update_post_url, asyncHandler(async function update_user_post(req, res, next) {
    edit_user_form.handle(req, {
      success: async function (form) {
        var user = await db.User.findByPk(req.params.userId);
        if (user) {
          if (user.name == form.data.name || !(await db.User.findOne({where: {username: form.data.username}}))) {
            if (await db.Role.findByPk(form.data.role)) {
              if (form.data.role == (await user.getRole()).id ||
                form.data.role != (await db.instances.roles.Admin.get(db)).id ||
                  (form.data.role == (await db.instances.roles.Admin.get(db)).id && 
                  (await db.instances.configs.CDAdmin.get(db)).value == 1))
              {
                user.name = form.data.name;
                user.username = form.data.username;
                user.class = form.data.class;
                user.divisionId = await db.Division.findByPk(form.data.division) ? form.data.division : null,
                user.roleId = form.data.role;
                user.password = form.data.password ? crypto.createHash('sha512').update(form.data.password).digest('hex') : user.password;
                await user.save();
                req.flash('info','Success!');
                req.session.save(function() {
                  res.redirect(table_get_url);
                });
              }
              else {
                req.flash('error', 'Cannot create an Administrator!');
                req.session.save(function() {
                  res.redirect(req.url);
                });
              }
            }
            else {
              req.flash('error', 'Invalid Role!');
              req.session.save(function() {
                res.redirect(req.url);
              });
            }
          }
          else {
            req.flash('error', 'User with the same username already exists!');
            req.session.save(function() {
              res.redirect(req.url);
            });
          }
        }
        else res.sendStatus(404);
      },
      other: async function (form) {
        var user = await db.User.findByPk(req.params.userId);
        if (user) {
          var divisions = await db.Division.findAll();
          var roles = await db.Role.findAll();
          form.fields.division.choices = [[0,'-']];
          form.fields.role.choices = [];
          divisions.forEach(function (division) {form.fields.division.choices.push([division.id,division.name])});
          roles.forEach(function (role) {form.fields.role.choices.push([role.id,role.name])});
          user.division = await user.getDivision();
          user.role = await user.getRole();
          form.fields.division.value = user.division ? user.division.id : 0;
          form.fields.role.value = user.role.id;
          form.fields.name.value = user.name;
          form.fields.username.value = user.username;
          form.fields.class.value = user.class;
          res.render('boilerplate_panel', {_template: 'panel/user/edit', user: user, form: form});
        }
        else res.sendStatus(404);
      }
    });
  }));

  /* GET delete user page */
  router.get(delete_get_url, asyncHandler(async function delete_user_get(req, res, next) {
    var user = await db.User.findByPk(req.params.userId);
    if (user) {
      if ((await user.getRole()).id != (await db.instances.roles.Admin.get(db)).id || (
            (await user.getRole()).id == (await db.instances.roles.Admin.get(db)).id && 
            (await db.instances.configs.CDAdmin.get(db)).value == 1)
        ) {
        await user.destroy();
        req.flash('info','Success!');
        req.session.save(function() {
          res.redirect(table_get_url);
        });
      }
      else {
        req.flash('error', 'Cannot delete an Administrator!');
        req.session.save(function() {
          res.redirect(table_get_url);
        });
      }
    }
    else res.sendStatus(404);
  }));

}

module.exports = sub;