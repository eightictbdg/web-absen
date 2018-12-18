const express = require('express');
const asyncHandler = require('express-async-handler')


function sub(router, db) {

  var division_form = require('../../../forms/division');
  var create_division_form = division_form();
  var edit_division_form = division_form();

  /* GET division table page */
  router.get('/panel/admin/division', asyncHandler(async function division_table_get(req, res, next) {
    var divisions = await db.Division.findAll();
    res.render('division/table', {divisions: divisions, form: create_division_form});
  }));

  /* POST create division page */
  router.post('/panel/admin/division', asyncHandler(async function add_division_post(req, res, next) {
    create_division_form.handle(req, {
      success: async function (form) {
        var division = await db.Division.create({
          name: form.data.name
        });
        var divisions = await db.Division.findAll();
        res.render('division/table', {divisions: divisions, form: create_division_form});
      },
      error: async function (form) {
        var divisions = await db.Division.findAll();
        res.render('division/table', {divisions: divisions, form: form});
      },
      empty: async function (form) {
        var divisions = await db.Division.findAll();
        res.render('division/table', {divisions: divisions, form: form});
      }
    });
  }));

  /* GET read division page */
  router.get('/panel/admin/division/:divisionId', asyncHandler(async function add_division_post(req, res, next) {
    var division = await db.Division.findByPk(req.params.divisionId);
    if (division) {
      res.render('division/read', { division: division });
    }
    else res.sendStatus(404);
  }));

  /* GET update division page */
  router.get('/panel/admin/division/:divisionId/update', asyncHandler(async function add_division_post(req, res, next) {
    var division = await db.Division.findByPk(req.params.divisionId);
    if (division) {
      edit_division_form.fields.name.value = division.name;
      res.render('division/edit', { division: division, form: edit_division_form });
    }
    else res.sendStatus(404);
  }));

  /* POST update division page */
  router.post('/panel/admin/division/:divisionId/update', asyncHandler(async function add_division_post(req, res, next) {
    edit_division_form.handle(req, {
      success: async function (form) {
        var division = await db.Division.findByPk(req.params.divisionId);
        if (division) {
          division.name = form.data.name;
          division.save();
          res.redirect('/panel/admin/division')
        }
        else res.sendStatus(404);
      },
      error: async function (form) {
        var division = await db.Division.findByPk(req.params.divisionId);
        if (division) res.render('division/edit', { division: division, form: form });
        else res.sendStatus(404);
      },
      empty: async function (form) {
        var division = await db.Division.findByPk(req.params.divisionId);
        if (division) res.render('division/edit', { division: division, form: form });
        else res.sendStatus(404);
      }
    });
  }));

  /* GET delete division page */
  router.get('/panel/admin/division/:divisionId/delete', asyncHandler(async function add_division_post(req, res, next) {
    var division = await db.Division.findByPk(req.params.divisionId);
    if (division) {
      division.destroy();
      res.redirect('/panel/admin/division')
    }
    else res.sendStatus(404);
  }));

}

module.exports = sub;