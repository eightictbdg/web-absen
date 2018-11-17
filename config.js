module.exports = {
  development: {
    dialect: 'sqlite',
    storage: './data/dev-db.sqlite3'
  },
  test: {
    dialect: 'sqlite',
    storage: './data/test-db.sqlite3'
  },
  production: {
    dialect: 'sqlite',
    storage: './data/prod-db.sqlite3'
  }
};