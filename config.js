module.exports = {
  development: {
    dialect: 'sqlite',
    storage: './database/dev-db.sqlite3',
    secret: process.env.SECRET || "eight ict web absen"
  },
  test: {
    dialect: 'sqlite',
    storage: './database/test-db.sqlite3',
    secret: process.env.SECRET || "eight ict web absen"
  },
  production: {
    dialect: 'sqlite',
    storage: './database/prod-db.sqlite3',
    secret: process.env.SECRET || "eight ict web absen"
  }
};