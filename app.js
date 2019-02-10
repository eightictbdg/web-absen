const express = require('express');
const flash = require('express-flash');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const config  = require('./config')

const db = require('./models').db;
const db_sync = require('./models').sync;

const env = process.env.NODE_ENV || 'development';

db_sync();

// init Express
const app = express();

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('./assets'));

app.use(session({
  secret: config[env].secret,
  resave: false,
  saveUninitialized: false,
  store: new FileStore,
  cookie: {secure: false},
  path: config[env].session_path
}));

app.use(flash());

var indexRouter = require('./routes/index')(db);
var loginRouter = require('./routes/auth')(db);
var registerRouter = require('./routes/register')(db);
var panelRouter = require('./routes/panel')(db);

app.use('/', indexRouter);
app.use('/', loginRouter);
app.use('/', registerRouter);
app.use('/', panelRouter);

module.exports = app