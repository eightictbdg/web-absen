const express = require('express');
const asyncHandler = require('express-async-handler')

const table_get_url = '/panel/division';
const create_post_url = '/panel/division';
const read_get_url = '/panel/division/:divisionId/read';
const update_get_url = '/panel/division/:divisionId/update';
const update_post_url = '/panel/division/:divisionId/update';
const delete_get_url = '/panel/division/:divisionId/delete';

const read_get_url_regex = '^\/panel\/division\/[0-9]*\/read$';
const update_get_url_regex = '^\/panel\/division\/[0-9]*\/update$';
const update_post_url_regex = '^\/panel\/division\/[0-9]*\/update$';
const delete_get_url_regex = '^\/panel\/division\/[0-9]*\/delete$';

function sub(router, db) {
  var division_form = require('../../forms/division');
  var create_division_form = division_form();
  var edit_division_form = division_form();

  var permission = db.instances.permissions.Panel.Division;

  function notAuthorized(req, res, next) {
    req.flash('error','Unauthorized Access!');
    req.session.save(function() {
      res.redirect('/');
    });
  }

  function unknownURL(req, res, next) {
    req.flash('error','Unknown URL! (' + req.url + ')')
    req.session.save(function() {
      res.redirect('/');
    });
  }

  router.use('/panel/division', function IsAuthorizedMiddleware(req, res, next) {
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

  /* GET division table page */
  router.get(table_get_url, asyncHandler(async function division_table_get(req, res, next) {
    var form = create_division_form;
    var perm = res.locals.rolePerms.find(obj => obj.name === permission.name);
    if (!(perm.RolePermission.perm.includes('c'))) {form = null;}
    var divisions = await db.Division.findAll();
    res.render('boilerplate_panel', {
      _template: 'panel/division/table', 
      divisions: divisions, 
      form: form 
    });
  }));

  /* POST create division page */
  router.post(create_post_url, asyncHandler(async function add_division_post(req, res, next) {
    create_division_form.handle(req, {
      success: async function (form) {
        try {
          var division = await db.Division.create({name: form.data.name});
          req.flash('info','Success!');
          req.session.save(function() {
            res.redirect(table_get_url);
          });
        }
        catch(err) {
          req.flash('error','A division with the same name already exists!');
          req.session.save(function() {
            res.redirect(table_get_url);
          });
        }
      },
      other: async function (form) {
        var perm = res.locals.rolePerms.find(obj => obj.name === permission.name);
        if (!(perm.RolePermission.perm.includes('c'))) {form = null;}
        var divisions = await db.Division.findAll();
        res.render('boilerplate_panel', {
          _template: 'panel/division/table', 
          divisions: divisions, 
          form: form 
        });
      }
    });
  }));

  /* GET read division page */
  router.get(read_get_url, asyncHandler(async function read_division_get(req, res, next) {
    var division = await db.Division.findByPk(req.params.divisionId);
    if (division) {
      division.users = await division.getUser();
      res.render('boilerplate_panel', {_template: 'panel/division/read', division: division});
    }
    else res.sendStatus(404);
  }));

  /* GET update division page */
  router.get(update_get_url, asyncHandler(async function update_division_get(req, res, next) {
    var division = await db.Division.findByPk(req.params.divisionId);
    if (division) {
      edit_division_form.fields.name.value = division.name;
      res.render('boilerplate_panel', {_template: 'panel/division/edit', division: division, form: edit_division_form});
    }
    else res.sendStatus(404);
  }));

  /* POST update division page */
  router.post(update_post_url, asyncHandler(async function update_division_post(req, res, next) {
    edit_division_form.handle(req, {
      success: async function (form) {
        var division = await db.Division.findByPk(req.params.divisionId);
        if (division) {
          if (division.name === form.data.name || !(await db.Division.findOne({where: {name: form.data.name}}))) {
            division.name = form.data.name;
            division.save();
            req.flash('info','Success!');
            req.session.save(function() {
              res.redirect(table_get_url);
            });
          }
          else {
            req.flash('error','A division with the same name already exists!');
            req.session.save(function() {
              res.redirect(req.url);
            });
          }
        }
        else res.sendStatus(404);
      },
      other: async function (form) {
        var division = await db.Division.findByPk(req.params.divisionId);
        if (division) res.render('boilerplate_panel', {
            _template: 'panel/division/edit',
            division: division,
            form: form
          });
        else res.sendStatus(404);
      }
    });
  }));

  /* GET delete division page */
  router.get(delete_get_url, asyncHandler(async function delete_division_get(req, res, next) {
    var division = await db.Division.findByPk(req.params.divisionId);
    if (division) {
      await division.destroy();
      req.flash('info','Success!');
      req.session.save(function() {
        res.redirect(table_get_url);
      });
    }
    else res.sendStatus(404);
  }));

}

module.exports = sub;