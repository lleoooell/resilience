var express = require('express'); // Get the module
var app = express(); // Create express by calling the prototype in var express
var http = require('http').createServer(app);



app.get('/', function(req, res){
   res.sendFile(__dirname + '/index.html');
});
app.get('/map', function(req, res){
   res.sendFile(__dirname + '/map.html');
});


app.use('/dist', express.static(__dirname + '/dist'));
app.use('/app', express.static(__dirname + '/app'));

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:',process.env.PORT || 3000);
});