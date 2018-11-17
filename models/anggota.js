module.exports = (sequelize, type) => {
  return sequelize.define('user', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: type.STRING,
      validate: {
        notNull: true
      }
    },
    password: {
      type: type.STRING,
      validate: {
        notNull: true
      }
    },
    nama: {
      type: type.STRING,
      validate: {
        notNull: true
      }
    },
    kelas: {
      type: type.STRING,
      validate: {
        notNull: true
      }
    }
  })
}