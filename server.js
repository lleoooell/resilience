var express = require('express'); // Get the module
var app = express(); // Create express by calling the prototype in var express
var http = require('http').createServer(app);

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('resilience');


app.get("/besoins", (req, res) => {
  const sql = "SELECT * FROM besoins";
  db.all(sql, (err, result) => {
    if (err) {
      return console.error(err.message);
    }
    res.json(result);
  });
});


app.post("/besoins", (req, res) => {
    var params=req.body;
    const sql = "INSERT INTO besoins (Nom,Addresse,Lat,Lng,MasquesFFP2,MasquesChir,Blouses,Gel,Autre,Comentaire,Contact) VALUES ("+params.Nom+","+params.Addresse+","+params.Lat+","+params.Lng+","+params.MasquesFFP2+","+params.MasquesChir+","+params.Blouses+","+params.Gel+","+params.Autre+","+params.Comentaire+","+params.Contact+")";
    db.run(sql, function(err) {
        if (err) {
        return console.log(err.message);
        res.json(err.message);
        }
        console.log(`A row has been inserted with rowid ${this.lastID}`);
        res.json("ok");
    });
});


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