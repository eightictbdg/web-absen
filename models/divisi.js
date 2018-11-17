module.exports = (sequelize, type) => {
  return sequelize.define('divisi', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nama: {
      type: type.STRING,
      validate: {
        notNull: true
      }
    }
  })
}