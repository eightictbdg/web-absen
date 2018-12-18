module.exports = {
  development: {
    dialect: 'sqlite',
    storage: './database/dev-db.sqlite3'
  },
  test: {
    dialect: 'sqlite',
    storage: './database/test-db.sqlite3'
  },
  production: {
    dialect: 'sqlite',
    storage: './database/prod-db.sqlite3'
  }
};