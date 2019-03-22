const express = require('express');
const asyncHandler = require('express-async-handler')

const table_get_url = '/panel/role';
const create_post_url = '/panel/role';
const read_get_url = '/panel/role/:roleId/read';
const update_get_url = '/panel/role/:roleId/update';
const update_post_url = '/panel/role/:roleId/update';
const delete_get_url = '/panel/role/:roleId/delete';

const read_get_url_regex = '^\/panel\/role\/[0-9]*\/read$';
const update_get_url_regex = '^\/panel\/role\/[0-9]*\/update$';
const update_post_url_regex = '^\/panel\/role\/[0-9]*\/update$';
const delete_get_url_regex = '^\/panel\/role\/[0-9]*\/delete$';


function sub(router, db) {
  var role_form = require('../../forms/role');
  var create_role_form = role_form();
  var edit_role_form = role_form();

  var permission = db.instances.permissions.Panel.Role;

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

  router.use('/panel/role', function IsAuthorizedMiddleware(req, res, next) {
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

  /* GET role table page */
  router.get(table_get_url, asyncHandler(async function role_table_get(req, res, next) {
    var form = create_role_form;
    var perm = res.locals.rolePerms.find(obj => obj.name === 'panel_role');
    if (!(perm.RolePermission.perm.includes('c'))) {form = null;}
    var roles = await db.Role.findAll();
    res.render('boilerplate_panel', {
      _template: 'panel/role/table', 
      roles: roles, 
      form: form 
    });
  }));

  /* POST create role page */
  router.post(create_post_url, asyncHandler(async function add_role_post(req, res, next) {
    create_role_form.handle(req, {
      success: async function (form) {
        try {
          var role = await db.Role.create({name: form.data.name});
          req.flash('info','Success!');
          req.session.save(function() {
            res.redirect(table_get_url);
          });
        }
        catch(err) {
          req.flash('error','A role with the same name already exists!');
          req.session.save(function() {
            res.redirect(table_get_url);
          });
        }
      },
      other: async function (form) {
        var roles = await db.Role.findAll();
        res.render('boilerplate_panel', {
          _template:'panel/role/table', 
          roles: roles, 
          form: form
        });
      }
    });
  }));

  /* GET read role page */
  router.get(read_get_url, asyncHandler(async function add_role_post(req, res, next) {
    var role = await db.Role.findByPk(req.params.roleId, {include: [{
      model: db.Permission, 
      as: 'permissions'
    }]});
    if (role) {
      role.users = await role.getUser();
      res.render('boilerplate_panel', {_template: 'panel/role/read', role: role});
    }
    else res.sendStatus(404);
  }));

  /* GET update role page */
  router.get(update_get_url, asyncHandler(async function add_role_post(req, res, next) {
    var role = await db.Role.findByPk(req.params.roleId);
    if (role) {
      edit_role_form.fields.name.value = role.name;
      res.render('boilerplate_panel', {_template:'panel/role/edit', role: role, form: edit_role_form });
    }
    else res.sendStatus(404);
  }));

  /* POST update role page */
  router.post(update_post_url, asyncHandler(async function add_role_post(req, res, next) {
    edit_role_form.handle(req, {
      success: async function (form) {
        var role = await db.Role.findByPk(req.params.roleId);
        if (role) {
          if (role.name === form.data.name || !(await db.Role.findOne({where: {name: form.data.name}}))) {
            role.name = form.data.name;
            role.save();
            req.flash('info','Success!');
            req.session.save(function() {
              res.redirect(table_get_url);
            });
          }
          else {
            req.flash('error','A role with the same name already exists!');
            req.session.save(function() {
              res.redirect(req.url);
            });
          }
        }
        else res.sendStatus(404);
      },
      other: async function (form) {
        var role = await db.Role.findByPk(req.params.roleId);
        if (role) res.render('boilerplate_panel', {
            _template:'panel/role/edit', 
            role: role, 
            form: form 
          });
        else res.sendStatus(404);
      }
    });
  }));

  /* GET delete role page */
  router.get(delete_get_url, asyncHandler(async function add_role_post(req, res, next) {
    var role = await db.Role.findByPk(req.params.roleId);
    if (role) {
      role.destroy();
      req.flash('info','Success!');
      req.session.save(function() {
        res.redirect(table_get_url);
      });
    }
    else res.sendStatus(404);
  }));
}

module.exports = sub;