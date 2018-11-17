const Sequelize = require('sequelize');
const AnggotaModel = require('./models/anggota')
const DivisiModel = require('./models/divisi')
const JadwalModel = require('./models/jadwal')
const PeranModel = require('./models/peran')

const env = process.env.NODE_ENV || 'development';
const config = require('./config.js')[env];

var sequelize = new Sequelize(config.database, config.username, config.password, config);
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


const Anggota = AnggotaModel(sequelize, Sequelize)
const Divisi = DivisiModel(sequelize, Sequelize)
const Jadwal = JadwalModel(sequelize, Sequelize)
const Peran = PeranModel(sequelize, Sequelize)

Anggota.hasMany(Jadwal, {as: 'Absen'});
Anggota.belongsTo(Divisi);
Divisi.hasMany(Anggota, {as: 'Anggota'});
Anggota.belongsTo(Peran);
Peran.hasMany(Anggota, {as: 'Anggota'});

sequelize.sync({ force: env == 'development' })
  .then(() => {
    console.log(`Database & tables synched!`)
  })
  
module.exports = {
  Anggota,
  Divisi,
  Jadwal,
  Peran
}