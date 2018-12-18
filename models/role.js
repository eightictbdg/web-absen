module.exports = (sequelize, type) => {
  return sequelize.define('role', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: type.STRING,
      allowNull: false
    }
  })
}