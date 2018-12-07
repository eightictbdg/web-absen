const express = require('express');

function app(db) {
  const router = express.Router();

  /* GET home page. */
  router.get('/', function(req, res, next) {
    if (req.session.logged_in) {
      db.User.findByPk(req.session.user_id)
        .then(function(user) {
          res.render('index', { title: 'Homepage', user: user});
        });
    }
    else {
      res.render('index', { title: 'Homepage' });
    }
  });

  return router;
}

module.exports = function(db) {
  return app(db);
}
