//initializer
var express = require('express');
var app = express();

//server code
var server = app.listen(80, function(){
    var host = server.address().address
    var port = server.address().port
    console.log("Server listening at  http://%s:%s", host,port)
})
app.use(express.static('assets'));

//server routing
app.get('/', function(req,res){
        res.send('Hello World');
        })
