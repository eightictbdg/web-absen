const app = require('./app');
const config = require('./config');

const env = process.env.NODE_ENV || 'development';
const ip_addr = process.env.IP || '0.0.0.0';
const port = process.env.PORT || 3000;

const secret = config[env].secret

// server code
var server = app.listen(port, ip_addr, function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log("Secret key:", secret)
  console.log("Server listening at  http://%s:%s", host,port);
});