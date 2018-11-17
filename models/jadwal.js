module.exports = (sequelize, type) => {
  return sequelize.define('jadwal', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    tanggal: {
      type: type.INTEGER,
      validate: {
        notNull: true,
        min: 1,
        max: 31
      }
    },
    bulan: {
      type: type.INTEGER,
      validate: {
        notNull: true,
        min: 1,
        max: 12
      }
    },
    tahun: {
      type: type.INTEGER,
      validate: {
        notNull: true,
        min: 0
      }
    },
    keterangan: type.STRING
  })
}