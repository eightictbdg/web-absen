module.exports = (sequelize, type) => {
  return sequelize.define('peran', {
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