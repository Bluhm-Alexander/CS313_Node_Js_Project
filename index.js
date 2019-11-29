var express = require('express');
var app = express();

//URL to database
const connectionString = "postgres://wdapxaygemutda:609bc059454803318c5efc525b866feef1bd79163a7e70cf080a24be6fccdd80@ec2-174-129-214-193.compute-1.amazonaws.com:5432/de0c0qif47rc23?ssl=true";

app.get('/', function(req, res){
   res.send("Hello world!");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);

