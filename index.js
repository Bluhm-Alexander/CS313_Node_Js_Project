const { Pool } = require('pg');
const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');

var app = express();

//SQL Statements
const passwordQuery = 'Select password from users where username = $1';
const userRecipeQuery = 'Select recipe_id, recipe_name, directions, timer_length from recipes where user_id = (select user_id from users where username = $1)';
const insertRecipe = 'INSERT INTO recipes (user_id, recipe_name, directions, timer_length) VALUES ((SELECT user_id FROM users WHERE username = $1 ), $2, $3, $4)';
const deleteRecipe = 'DELETE FROM recipes WHERE recipe_id = $1';
const signUp = 'INSERT INTO users (first_name, last_name, username, password) VALUES ($1, $2, $3, $4)';
const userCheck = 'SELECT username FROM users WHERE username = $1';


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
app.get('/mainPage', (req, res) => res.render('mainPage'))
app.get('/addRecipe', (req, res) => res.render('addRecipe'))
app.get('/signUp', (req, res) => res.render('signUp'))
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(session({secret: 'NULL', saveUninitialized:true, resave: true})); // support for settions data

//Server Time Functions
//Function order is important
function logRequest(req, res, next) {
// log all requests
  //console.log("Received a request for: " + req.url);
next();
}

app.use(logRequest)

function verifyLogin(req, res, next) {
if (req.session.username) {
  //console.log(req.session.username);
  next();
} else {
res.status(401);
res.json({"success":false,
"message":"Error: forbidden"});
}
}

app.use('/getServerTime', verifyLogin) 

app.get('/getServerTime', (req, res) => {
  var time = new Date();
  var respondWith = {
  "success":true,
  "time":time
  };
  return res.json(time);
  })

// Global variable for session
// var sess;

// Post handling for login
app.post('/login', (req, res) => {
  // store the information sent to us from the post into variables
  var username = req.body.username;
  var password = req.body.password;
  // DEV-NOTE: A wild log has appeared
  console.log(username, password);
  //Telling it what kind of content to expect in the response
  //res.setHeader('Content-type', 'text/plain');
  res.setHeader('Content-type', 'application/json');
  pool.query(passwordQuery, [username], (err, results) => {
    if (err) {
        throw err
    }
    var respondWith = {"success": true};
    //var respondWith = "error";
    if (results.rows[0]["password"] == password) {
      //Send the user to the application page recipe page whatever
      //res.send("success"); // Probably don't need this
      res.json({"success": true});
      req.session.username = username;
      req.session.save();
      //sess.username = username;
      return;
    } 
    else {
      //just send the data with error have javascript handle where that error appears in page
      //res.send("Invalid Username or Password");
      res.json({"success": false});
      return;
    }
    res.status(200);
    return res.send(respondWith);
})
})

/***********************************************************************
 * Post handling for addRecipe
 * ********************************************************************/
app.post('/addRecipe', (req, res) => {
  // store the information sent to us from the post into variables
  var newRecipeName = req.body.newRecipeName;
  var newRecipe = req.body.newRecipe;
  var defaultTimer = 0;
  //Telling it what kind of content to expect in the response
  //res.setHeader('Content-type', 'text/plain');
  res.setHeader('Content-type', 'application/json');
  pool.query(insertRecipe, [req.session.username, newRecipeName, newRecipe, defaultTimer], (err, results) => {
    if (err) {
        throw err
    }
    res.json({"success": true});
})
})

/***********************************************************************
 * Post handling for SignUp
 * ********************************************************************/
app.post('/signUp', (req, res) => {
  // store the information sent to us from the post into variables
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var username = req.body.username;
  var password = req.body.password;
  
  var isUnique = false;

  pool.query(userCheck, [username], (err, results) => {
    if( results.rows[0]["username"] == username ) {
      isUnique = false;
    }
    else {
      isUnique = true;
    }
  })

  res.setHeader('Content-type', 'application/json');

  if( isUnique ) {
    pool.query(signUp, [first_name, last_name, username, password], (err, results) => {
      if (err) {
          throw err
      }
      res.json({"success": true});
    })
  }
  else {
    res.json({"success": false});
  }
})

/***********************************************************************
 * Post handling for deleteRecipe
 * ********************************************************************/
app.post('/deleteRecipe', (req, res) => {
  // store the information sent to us from the post into variables
  var recipeId = req.body.recipeId;
  //Telling it what kind of content to expect in the response
  //res.setHeader('Content-type', 'text/plain');
  res.setHeader('Content-type', 'application/json');
  pool.query(deleteRecipe, [recipeId], (err, results) => {
    if (err) {
        throw err
    }
    res.json({"success": true});
})
})

// Post handling for logout
app.post('/logout', (req, res) => {
  //Telling it what kind of content to expect in the response
  //res.setHeader('Content-type', 'text/plain');
  res.setHeader('Content-type', 'application/json');

  if( req.session.username )
  {
    req.session.destroy();
    res.json({"success": false});
    return;
  }
  else
  {
    res.json({"success": true});
    return;
  }
})

// When the main page is called return information important to the user
// give the information in a JSON so we can pass it all at once
app.get('/getUserInfo', (req, res) => {
  res.setHeader('Content-type', 'text/plain');
  res.send(req.session.username);
});

/*********************************************************************************
 *    FUNCTION: /getUserRecipes
 *      
 ********************************************************************************/
app.get('/getUserRecipes', (req, res)=> {
  res.setHeader('Content-type', 'application/json');

  //Query database for all recipes related to a user
  pool.query(userRecipeQuery, [req.session.username], (err, results) => {
    if (err) {
        throw err
    }
    var allRecipes = [];
    for( var i = 0; i < results.rows.length; i++ )
    {
      allRecipes.push( {recipe_id: results.rows[i]["recipe_id"], recipe_name: results.rows[i]["recipe_name"], directions: results.rows[i]["directions"], timer_length: results.rows[i]["timer_length"]} );
    }
    
    
    res.json( allRecipes );
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);

