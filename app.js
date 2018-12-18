const express = require('express');
const crypto = require('crypto');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

const db = require('./db');

// init Express
const app = express();

const ip_addr = '127.0.0.1';
const port = 3000;
const secret = "eight ict web absen";

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('./assets'));
app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: false,
  store: new FileStore,
  cookie: { secure: false,}
}));

var indexRouter = require('./routes/index')(db);
var loginRouter = require('./routes/auth')(db);
var registerRouter = require('./routes/register')(db);
var panelRouter = require('./routes/panel')(db);

app.use('/', indexRouter);
app.use('/', loginRouter);
app.use('/', registerRouter);
app.use('/', panelRouter);

// server code
var server = app.listen(port, ip_addr, function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log("Secret key:", secret)
  console.log("Server listening at  http://%s:%s", host,port);
});