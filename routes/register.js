const express = require('express');
const crypto = require('crypto');
const asyncHandler = require('express-async-handler')

function init(db) {
  const router = express.Router();

  var register_form = require('../forms/register');

  router.get('/register', async function register_get(req,res,next) {
    if (!req.session.logged_in) {
      var divisions = await db.Division.findAll();
      var roles = await db.Role.findAll();
      register_form.fields.division.choices = [[0,'-']];
      register_form.fields.role.choices = [];
      divisions.forEach(function (division) { register_form.fields.division.choices.push([division.id,division.name]) });
      roles.forEach(function (role) { register_form.fields.role.choices.push([role.id,role.name]) });
      res.render('boilerplate', { _template: 'register', title: 'Register', form: register_form.toHTML() });
    }
    else {
      res.redirect('/');
    }
  });

  router.post('/register', asyncHandler(async function register_post(req,res,next) {
    register_form.handle(req, {
      success: async function (form) {
        var user = await db.User.findOne({ where: {username: form.data.username} });
        if (!user) {
          var division = await db.Division.findByPk(form.data.division);
          var role = await db.Division.findByPk(form.data.role);
          var user = await db.User.create({
            name: form.data.name,
            username: form.data.username,
            class: form.data.class,
            password: crypto.createHash('sha512').update(form.data.password).digest('hex'),
            divisionId: await db.Division.findByPk(form.data.division) ? form.data.division : null,
            roleId: form.data.role
          });
          req.session.logged_in = true;
          req.session.user_id = user.id;
          req.session.save(function() {
            req.flash('info','Registration successful!');
            res.redirect('/');
          });
        }
        else {
          req.flash('error','Username already exists.')
          res.render('boilerplate', { _template: 'register', title: 'Register', form: form.toHTML()});
        }
      },
      other: function (form) {
        res.render('boilerplate', { _template: 'register', title: 'Register', form: form.toHTML()});
      }
    });
  }));

  return router;
}

module.exports = init;
