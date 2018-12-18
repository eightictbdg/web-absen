const express = require('express');
const crypto = require('crypto');
const asyncHandler = require('express-async-handler')

function init(db) {
  const router = express.Router();

  var register_form = require('../forms/register');

  router.get('/register', function register_get(req,res,next) {
    res.render('boilerplate', { _template: 'register', title: 'Register', form: register_form.toHTML() });
  });

  router.post('/register', asyncHandler(async function register_post(req,res,next) {
    register_form.handle(req, {
      success: async function (form) {
        // there is a request and the form is valid
        // form.data contains the submitted data
        var user = await db.User.findOne({ where: {username: form.data.username} });
        if (user) {
          var error = 'Username already exist.'
          res.render('boilerplate', { _template: 'register', title: 'Register', form: form.toHTML(), error: error });
        }
        else {
          var user = await db.User.create({
            name: form.data.name,
            username: form.data.username,
            class: form.data.class,
            password: crypto.createHash('sha512').update(form.data.password).digest('hex')
          });
          req.session.logged_in = true;
          req.session.user_id = user.id
          res.redirect('/');
        }
      },
      error: function (form) {
        // the data in the request didn't validate,
        // calling form.toHTML() again will render the error messages
        res.render('boilerplate', { _template: 'register', title: 'Register', form: form.toHTML()});
      },
      empty: function (form) {
        // there was no form data in the request
        res.render('boilerplate', { _template: 'register', title: 'Register', form: form.toHTML()});
      }
    });
  }));

  return router;
}

module.exports = init;
