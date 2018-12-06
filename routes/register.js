const express = require('express');
const crypto =require('crypto');

function app(db) {
  const router = express.Router();

  var register_form = require('../forms/register');

  /* GET register page. */
  router.get('/register', function(req, res, next) {
    res.render('register', { title: 'Register', form: register_form.toHTML() });
  });

    /* POST register page. */
  router.post('/register', function(req, res, next) {
    register_form.handle(req, {
      success: function (form) {
        // there is a request and the form is valid
        // form.data contains the submitted data
        db.User.findOne({ where: {username: form.data.username} }).then(function(user) {
          if (user) {
            var error = 'Username already exist.'
            res.render('register', { title: 'Register', form: form.toHTML(), error: error });
          }
          else {
            var user = db.User.create({
              name: form.data.name,
              username: form.data.username,
              password: crypto.createHash('sha512').update(form.data.password).digest('hex')
            }).then(function(user) {
              req.session.logged_in = true;
              req.session.user_id = user.id
              res.redirect('/');
            });
          }
        });
      },
      error: function (form) {
        // the data in the request didn't validate,
        // calling form.toHTML() again will render the error messages
        res.render('register', { title: 'Register', form: form.toHTML()});
      },
      empty: function (form) {
        // there was no form data in the request
        res.render('register', { title: 'Register', form: form.toHTML()});
      }
    });
  });

  return router;
}

module.exports = function(db) {
  return app(db);
}
