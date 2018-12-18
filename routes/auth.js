const express = require('express');
const crypto = require('crypto');
const asyncHandler = require('express-async-handler')

function init(db) {
  const router = express.Router();

  var login_form = require('../forms/login')


  /* GET login page. */
  router.get('/login', function login_get(req, res, next) {
    res.render('boilerplate', { _template: 'login', title: 'Login', form: login_form.toHTML() });
  });

  /* POST login page. */
  router.post('/login', asyncHandler(async function login_post(req, res, next) {
    login_form.handle(req, {
      success: async function (form) {
        // there is a request and the form is valid
        // form.data contains the submitted data
        var user = await db.User.findOne({ where: {
          username: form.data.username,
          password: crypto.createHash('sha512').update(form.data.password).digest('hex')
        } });
        if (user) {
          req.session.logged_in = true;
          req.session.user_id = user.id;
          res.redirect('/');
        }
        else {
          var error = 'Wrong username or password.'
          res.render('boilerplate', { _template: 'login', title: 'Login', form: login_form.toHTML(), error: error });
        }
      },
      error: function (form) {
        // the data in the request didn't validate,
        // calling form.toHTML() again will render the error messages
        res.render('boilerplate', { _template: 'login', title: 'Login', form: form.toHTML() });
      },
      empty: function (form) {
        // there was no form data in the request
        res.render('boilerplate', { _template: 'login', title: 'Login', form: form.toHTML() });
      }
    });
  }));

  router.get('/logout', function logout_get(req, res, next) {
    req.session.logged_in = false;
    req.session.user_id = null;
    res.redirect('/');
  });

  return router;
}

module.exports = init;