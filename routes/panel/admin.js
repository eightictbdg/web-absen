const express = require('express');
const asyncHandler = require('express-async-handler')


function sub(router, db) {
  // Check if user has the right role
  router.use('/panel/admin', asyncHandler(async function isAdminMiddleware(req, res, next) {
    if (req.session.logged_in) {
      var user = await db.User.findByPk(req.session.user_id);
      var role = await user.getRole();
      if (role.name == 'Administrator') {
        next();
      }
      else res.redirect('/');
    }
    else res.redirect('/');
  }));

  
  /* GET panel page. */
  router.get('/panel/admin', asyncHandler(async function admin_panel_get(req, res, next) {
    res.render('panel_admin', { title: 'Admin Panel'});
  }));

  require('./admin/crud_schedule.js')(router,db);
  require('./admin/crud_division.js')(router,db);
  require('./admin/crud_role.js')(router,db);
  require('./admin/crud_user.js')(router,db);
}

module.exports = sub;