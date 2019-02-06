module.exports = (sequelize, type) => {
  return sequelize.define('division', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: type.STRING,
      unique: true,
      allowNull: false
    }
  })
}