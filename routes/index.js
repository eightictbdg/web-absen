const express = require('express');
const asyncHandler = require('express-async-handler')

function init(db) {
  const router = express.Router();

  router.use('/', function isLoggedInMiddleware(req, res, next) {
    res.locals._logged_in = req.session.logged_in ? true : false;
    next();
  })

  /* GET home page. */
  router.get('/', asyncHandler(async function index_get(req, res, next) {
    if (req.session.logged_in) {
      var user = await db.User.findByPk(req.session.user_id)
      var role = await user.getRole()
      res.render('boilerplate', { _template: 'index', title: 'Homepage', user: user, role: role});
    }
    else {
      res.render('boilerplate', { _template: 'index', title: 'Homepage' });
    }
  }));

  return router;
}

module.exports = init;