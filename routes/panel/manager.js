const express = require('express');
const asyncHandler = require('express-async-handler')


function sub(router, db) {
  // Check if user has the right role
  router.use('/panel/manager', asyncHandler(async function isManagerMiddleware(req, res, next) {
    if (req.session.logged_in) {
      var user = await db.User.findByPk(req.session.user_id);
      if (!user) res.redirect('/logout')
      var role = await user.getRole();
      if (role.name == (await db.instances.roles.Manager.get(db)).name) {
        res.locals.title = 'Manager Panel',
        res.locals.userRole = role.name
        next();
      }
      else res.redirect('/');
    }
    else res.redirect('/');
  }));

  
  /* GET panel page. */
  router.get('/panel/manager', asyncHandler(async function manager_panel_get(req, res, next) {
    res.render('boilerplate', {_template: 'manager/panel', current: req.url});
  }));

  require('./manager/crud_schedule.js')(router,db);
}

module.exports = sub;