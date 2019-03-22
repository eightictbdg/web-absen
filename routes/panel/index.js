const express = require('express');
const asyncHandler = require('express-async-handler');

function init(db) {
  const router = express.Router();

  // Check if user is logged in and valid
  router.use('/panel', asyncHandler(async function isAdminMiddleware(req, res, next) {
    if (req.session.logged_in) {
      var user = await db.User.findByPk(req.session.user_id);
      if (user) {
        var role = await user.getRole();
        var perms = await role.getPermissions();
        res.locals.rolePerms = perms;
        res.locals.title = 'Panel';
        next();
      } 
      else res.redirect('/logout');
    }
    else res.redirect('/');
  }));
  
  /* GET panel page. */
  router.get('/panel', asyncHandler(async function admin_panel_get(req, res, next) {
    res.render('boilerplate', {_template: 'panel/panel', currentUrl: req.url});
  }));

  require('./ru_config.js')(router,db);
  require('./crud_schedule.js')(router, db);
  require('./crud_division.js')(router,db);
  require('./crud_role.js')(router,db);
  require('./crud_user.js')(router,db);
  require('./r_csv.js')(router,db);
  require('./c_attend.js')(router,db);

  return router;
}

module.exports = init;