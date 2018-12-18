const express = require('express');
const asyncHandler = require('express-async-handler')

function init(db) {
  const router = express.Router();

  require('./panel/admin')(router,db);

  /* GET panel page. */
  router.get('/panel', asyncHandler(async function admin_panel(req, res, next) {
    if (req.session.logged_in) {
      var user = await db.User.findByPk(req.session.user_id);
      var role = await user.getRole();
      if (role.name == 'Administrator') {
        res.redirect('/panel/admin');
      }
      else if (role.name == 'Pengurus') {
        res.redirect('/panel/pengurus');
      }
      res.render('index', { title: 'Homepage', user: user, role:role});
    }
    else {
      res.redirect('/');
    }
  }));

  return router;
}

module.exports = init;
