const crypto = require('crypto');

function start(db) {
  var User = db.User;
  var Division = db.Division;
  var Schedule = db.Schedule;
  var Role = db.Role;

  // defining default user 'admin'
  Role.create({name: 'Administrator'})
    .then(function(admin_role) {
      User.create({
        name: 'Administrator',
        username: 'admin',
        password: crypto.createHash('sha512').update('admin').digest('hex')
      }).then(function(admin) {
        admin_role.setUser(admin);
      });
    });

  // defining roles
  Role.bulkCreate([
    {name: 'Pengurus'},
    {name: 'Anggota'},
    {name: 'Calon Anggota'}
  ]);

  // defining divisions
  Division.bulkCreate([
    {name: 'Design'},
    {name: 'Programming'},
    {name: 'Gaming'}
  ]);
}

module.exports = start;