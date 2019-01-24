module.exports = (sequelize, type) => {
  return sequelize.define('user', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: type.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: type.STRING,
      allowNull: false
    },
    name: {
      type: type.STRING,
      allowNull: false
    },
    class: {
      type: type.STRING
    },
    is_approved: {
      type: type.INTEGER
    }
  })
}