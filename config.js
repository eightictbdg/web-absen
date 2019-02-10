module.exports = {
  development: {
    dialect: 'sqlite',
    storage: process.env.DATA_DIR ? process.env.DATA_DIR + '/database/dev-db.sqlite3' : './database/dev-db.sqlite3',
    secret: process.env.SECRET || "eight ict web absen",
    session_path: process.env.DATA_DIR ? process.env.DATA_DIR + '/sessions' : './sessions'
  },
  test: {
    dialect: 'sqlite',
    storage: process.env.DATA_DIR ? process.env.DATA_DIR + '/database/test-db.sqlite3' : './database/test-db.sqlite3',
    secret: process.env.SECRET || "eight ict web absen",
    session_path: process.env.DATA_DIR ? process.env.DATA_DIR + '/sessions' : './sessions'
  },
  production: {
    dialect: 'sqlite',
    storage: process.env.DATA_DIR ? process.env.DATA_DIR + '/database/prod-db.sqlite3' : './database/prod-db.sqlite3',
    secret: process.env.SECRET || "eight ict web absen",
    session_path: process.env.DATA_DIR ? process.env.DATA_DIR + '/sessions' : './sessions'
  }
};