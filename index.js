const { Pool } = require('pg');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

var app = express();

//SQL Statements
const passwordQuery = 'Select password from users where username = $1';


//allocate new pool with url information for postgresql database
const connectionString = "postgres://wdapxaygemutda:609bc059454803318c5efc525b866feef1bd79163a7e70cf080a24be6fccdd80@ec2-174-129-214-193.compute-1.amazonaws.com:5432/de0c0qif47rc23?ssl=true";
const pool = new Pool({
  connectionString: connectionString,
  ssl: true
});

// Set app
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'pages'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('login'))
app.get('/success', (req, res) => res.render('success'))
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//database functions


// Post handling for login
app.post('/login', (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  //A wild log has appeared
  console.log(username, password);
  //Telling it what kind of content to expect in the response
  res.setHeader('Content-type', 'text/plain');
  pool.query(passwordQuery, [username], (err, results) => {
    if (err) {
        throw err
    }
    var respondWith = "error";
    if (results.rows.length == 0) {
      //just send the data with error have javascript handle where that error appears in page
        res.send("Invalid Username or Password");
        return;
    } else {
      //Send the user to the application page recipe page whatever
      res.send("success");
      return;
    }
    res.status(200);
    return res.send(respondWith);
})
})


app.get('/', function(req, res){
   res.send("Hello world!");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);

