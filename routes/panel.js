const express = require('express');
const asyncHandler = require('express-async-handler')

function init(db) {
  const router = express.Router();

  require('./panel/admin')(router,db);
  require('./panel/manager')(router,db);
  require('./panel/member')(router,db);
  require('./panel/initiate')(router,db);

  /* GET panel page. */
  router.get('/panel', asyncHandler(async function admin_panel(req, res, next) {
    if (req.session.logged_in) {
      var user = await db.User.findByPk(req.session.user_id);
      var role = await user.getRole();
      if (role === null) {
        res.redirect('/');
      }
      else if (role.name == 'Administrator') {
        res.redirect('/panel/admin');
      }
      else if (role.name == 'Pengurus') {
        res.redirect('/panel/manager');
      }
      else if (role.name == 'Anggota') {
        res.redirect('/panel/member');
      }
      else if (role.name == 'Calon Anggota') {
        res.redirect('/panel/initiate');
      }
      else {
        res.redirect('/');
      }
    }
    else {
      res.redirect('/');
    }
  }));

  return router;
}

module.exports = init;
