var express = require('express'); // Get the module
var app = express(); // Create express by calling the prototype in var express
var https = require('https');
var fs = require('fs');

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
 
// parse application/json
app.use(bodyParser.json());
var http = require('http').createServer(app);

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('resilience.sqlite');


app.get("/besoins", (req, res) => {
    const sql = "SELECT * FROM besoins";
    db.all(sql, (err, result) => {
        if (err) {
            return console.error(err.message);
        }
        res.json(result);
    });
});

app.get("/besoins/:lat1/:lng1/:lat2/:lng2/:secteur", (req, res) => {
    var params=req.params;
    const sql = "SELECT * FROM besoins WHERE lat>"+params.lat1+" AND lat<"+params.lat2+" AND lng>"+params.lng1+" AND lat<"+params.lng2 +" AND Secteur='"+params.secteur+"'";
    db.all(sql, (err, result) => {
        if (err) {
            return console.error(err.message);
        }
        res.json(result);
    });
});

app.get("/besoins/:lat1/:lng1/:lat2/:lng2", (req, res) => {
    var params=req.params;
    const sql = "SELECT * FROM besoins WHERE lat>"+params.lat1+" AND lat<"+params.lat2+" AND lng>"+params.lng1+" AND lng<"+params.lng2;
    db.all(sql, (err, result) => {
        if (err) {
            return console.error(err.message);
        }
        res.json(result);
    });
});

app.post("/besoins", (req, res) => {
    var params=req.body;
    console.log(params);
    const sql = "INSERT INTO besoins (Nom,Addresse,Lat,Lng,MasquesFFP2,MasquesChir,Blouses,Gel,Autre,Commentaire,Contact,Secteur,Company,Gant) VALUES ('"+params.Nom+"','"+params.Adresse+"',"+params.Lat+","+params.Lng+","+params.MasquesFFP2+","+params.MasquesChir+","+params.Blouses+","+params.Gel+",'"+params.Autre+"','"+params.Commentaire+"','"+params.Contact+"','"+params.Secteur+"','"+params.Company+"',"+params.Gants+")";
    console.log(sql);
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
app.get('/aide', function(req, res){
   res.sendFile(__dirname + '/aide.html');
});

app.use('/dist', express.static(__dirname + '/dist'));
app.use('/app', express.static(__dirname + '/app'));
app.use('/lib', express.static(__dirname + '/lib'));



// Certificate
const privateKey = fs.readFileSync('./keys/privkey.pem', 'utf8');
const certificate = fs.readFileSync('./keys/cert.pem', 'utf8');
const ca = fs.readFileSync('./keys/chain.pem', 'utf8');

const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
};
// const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

http.listen(process.env.PORT || 3000, function(){
    console.log('listening on *:',process.env.PORT || 3000);
});
httpsServer.listen(443, () => {
    console.log('HTTPS Server running on port 443');
});
