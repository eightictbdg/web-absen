module.exports = (sequelize, type) => {
  return sequelize.define('config', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: type.STRING,
      allowNull: false,
      unique: true
    },
    value: {
      type: type.STRING
    }
  })
}