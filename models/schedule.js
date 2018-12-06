module.exports = (sequelize, type) => {
  return sequelize.define('schedule', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: type.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 31
      }
    },
    month: {
      type: type.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 12
      }
    },
    year: {
      type: type.INTEGER,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    info: type.STRING,
    passkey: {
      type: type.STRING,
      allowNull: false
    }
  })
}