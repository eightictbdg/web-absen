// init Express
const express = require('express');
const crypto = require('crypto');
const db = require('./db')
const session = require('express-session')

const app = express();

const ip_addr = process.env.IP || '0.0.0.0';
const port = process.env.PORT || 3000;

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('./assets'));
app.use(session({ 
  secret: crypto.randomBytes(20).toString('hex'),
  cookie: { maxAge: 60000 }
}));

var indexRouter = require('./routes/index')(db);
var loginRouter = require('./routes/auth')(db);
var registerRouter = require('./routes/register')(db);

app.use('/', indexRouter);
app.use('/', loginRouter);
app.use('/', registerRouter);

// server code
var server = app.listen(port, ip_addr, function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log("Server listening at  http://%s:%s", host,port);
});