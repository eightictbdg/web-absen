// init Express
const express = require('express');
const ip_addr = '0.0.0.0';
const port = 3000;
const { Anggota, Divisi, Jadwal, Peran } = require('./db')
const app = express();

// server code
var server = app.listen(port, ip_addr, function(){
  var host = server.address().address
  var port = server.address().port
  console.log("Server listening at  http://%s:%s", host,port)
});

app.use(express.static('assets'));

// server routing
app.get('/', function(req,res){
  res.send('Hello World');
});