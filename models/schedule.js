module.exports = (sequelize, type) => {
  return sequelize.define('schedule', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: type.STRING,
      allowNull: false
    },
    info: type.STRING,
    passkey: {
      type: type.STRING,
      allowNull: false
    }
  })
}