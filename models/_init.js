const crypto = require('crypto');

async function start(db) {
  var User = db.User;
  var Division = db.Division;
  var Schedule = db.Schedule;
  var Role = db.Role;

  // defining default user 'admin'
  var admin_role = await Role.create({name: 'Administrator'});
  var admin = await User.create({
    name: 'Administrator',
    username: 'admin',
    password: crypto.createHash('sha512').update('admin').digest('hex')
  });
  admin_role.setUser(admin);

  // defining roles
  await Role.bulkCreate([
    {name: 'Pengurus'},
    {name: 'Anggota'},
    {name: 'Calon Anggota'}
  ]);

  // defining divisions
  await Division.bulkCreate([
    {name: 'Design'},
    {name: 'Programming'},
    {name: 'Gaming'}
  ]);
}

module.exports = start;