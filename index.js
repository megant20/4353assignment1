// YOU CAN USE THIS FILE AS REFERENCE FOR SERVER DEVELOPMENT

// include the express module
var express = require("express");

// create an express application
var app = express();

// helps in extracting the body portion of an incoming request stream
var bodyparser = require('body-parser');

// fs module - provides an API for interacting with the file system
var fs = require("fs");

// helps in managing user sessions
var session = require('express-session');

// native js function for hashing messages with the SHA-256 algorithm
var crypto = require('crypto');

// include the mysql module
var mysql = require("mysql");

var xml2js = require('xml2js');

var xmlParser = xml2js.parseString;

// use express-session
// in memory session is sufficient for this assignment
app.use(session({
  secret: "group28",
  saveUninitialized: true,
  resave: false
}));

// apply the body-parser middleware to all incoming requests
app.use(bodyparser());
app.use(bodyparser.json());


// Read in XML config file;
var text = fs.readFileSync("./dbconfig.xml").toString('utf-8');

var xmlConfig;
xmlParser(text, function(err,result){
  xmlConfig = result.dbconfig;
});

var cfg = {
  connectionLimit: xmlConfig.connectionLimit[0],
  host: xmlConfig.host[0],
  user: xmlConfig.user[0],
  password: xmlConfig.password[0],
  database: xmlConfig.database[0],
  port: xmlConfig.port[0]
}

// Connect to mysql server
var con = mysql.createPool(cfg);

// server listens on port 9001 for incoming connections
app.listen(process.env.PORT || 9001, () => console.log('Listening on port 9001!'));

app.get('/',function(req, res) {
  res.sendFile(__dirname + '/client/landingpage.html');
});

// // GET method route for getClientInfoDatabase page.
// Grab user's information to use for fuelquotehistory
app.get('/getClientInfoDatabase',function(req, res) {
  con.query('SELECT * FROM clientInformation', function(err,result,fields) {
    if (err) throw err;
    if (result.length == 0) {
      console.log("No entries in accounts table");
    } else { // Send Accounts table
      console.log(result);
      res.send(result);
    }
  });
});

// GET method route for the addEvent page.
// It serves addEvent.html present in client folder
app.get('/completeprofile',function(req, res) {

  if (req.session.loggedin) {
    res.sendFile(__dirname + '/client/completeprofile.html');
  } else {
    res.redirect('/login');
  }
});

//GET method for fuelquoteform page
app.get('/fuelquoteform', function (req, res) {
  if (req.session.loggedin) {
    res.sendFile(__dirname + '/client/fuelquoteform.html');
  } else {
    res.redirect('/login');
  }
});

//GET method for fuelquotehistory page
app.get('/fuelquotehistory', function (req, res) {
  if (req.session.loggedin) {
    res.sendFile(__dirname + '/client/fuelquotehistory.html');
  } else {
    res.redirect('/login');
  }
});

//GET method for updateprofile page
app.get('/updateprofile', function (req, res) {
  if (req.session.loggedin) {
    res.sendFile(__dirname + '/client/updateprofile.html');
  } else {
    res.redirect('/login');
  }
});


// GET method route for the login page.
// It serves login.html present in client folder
app.get('/login',function(req, res) {
  if(!req.session.loggedin) {
    res.sendFile(__dirname + '/client/login.html');
  } else {
    res.redirect('/fuelquoteform');
  }
});

app.post('/addUser', function(req, res) {
    var userName = req.body.uid;
    var userPass =  crypto.createHash('sha256').update(req.body.pwd).digest('base64');
    if (userName && userPass) {
      con.query('SELECT * FROM userCredentials WHERE username = ?', [userName], function(error, results, fields) {
        //User Doesn't Exist
        if (!results.length){
          console.log("Hello World");
          var rowToBeInserted = {
            username: userName,
            password: userPass
          };
        con.query('INSERT userCredentials SET ?', rowToBeInserted, function(err, result) {
          if(err) {
          throw err;
          }
          console.log("Value inserted");
          req.session.loggedin = true;
          req.session.username = userName;
          req.session.login = userName;
          res.redirect('/completeprofile');
        });
      } else{
        console.log("user EXISTS!");
        res.send('user already exists!');
      }
		});
    } else {
      console.log("Invalid UserData: one or more entries are missing!");
      res.send("Invalid UserData: one or more entries are missing!")
    }
});

app.post('/newProfile', function(req, res) {
    var fullName = req.body.fullname;
    var addy1 = req.body.addressline1;
    var addy2 = req.body.addressline2;
    var ncity = req.body.city;
    var state = req.body.state;
    var zipmain = req.body.zipmain;
    var zipfour = req.body.zipplusfour;

    var username = 	req.session.username;
    if (username) {
      con.query('SELECT * FROM userCredentials WHERE username = ?', [username], function(error, results, fields) {
        //User Doesn't Exist
        if (results.length){
          console.log("Saving Info");
          var rowToBeInserted = {
            username: username,
            addressLine1: addy1,
            addressLine2: addy2,
            city: ncity,
            state: state,
            zipMain: zipmain,
            zipPlus4: zipfour
          };
        con.query('INSERT clientInformation SET ?', rowToBeInserted, function(err, result) {
          if(err) {
          throw err;
          }
          console.log("Value inserted");
          // req.session.loggedin = true;
          // req.session.username = userName;
          // req.session.login = userName;
          res.redirect('/fuelquoteform');
        });
      } else{
        console.log("ERROR!");
      }
		});
    } else {
      console.log("Invalid UserData: one or more entries are missing!");
      res.send("Invalid UserData: one or more entries are missing!")
    }
});

// POST method to validate user login
// upon successful login, user session is created
app.post('/sendLoginDetails', function(req, res) {
  var username = req.body.emailuid;
	var password = crypto.createHash('sha256').update(req.body.pwd).digest('base64');
	if (username && password) {
		con.query('SELECT * FROM userCredentials WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				req.session.loggedin = true;
				req.session.username = username;
        req.session.login = username;
			} else {
				res.send('Incorrect Username and/or Password!');
			}
		});
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
  con.query('SELECT * FROM clientInformation WHERE username = ?', [username], function(error2, results2, fields2) {
    if (results2.length > 0) {
      res.redirect('/fuelquoteform')
    }
    else {
      res.redirect('/completeprofile')
    }
    res.end();
  });
});

// Gets the session for returning the username
app.get('/userLogin', function (req, res) {
  if (req.session.loggedin) {
    res.send(req.session);
  } else {
    res.redirect('/login');
  }
});

// log out of the application
// destroy user session
app.get('/logout', function(req, res) {
  if(!req.session.loggedin) {
    res.send('Session not started, can not logout!');
  } else {
    console.log ("Session Destroyed!");
    req.session.destroy();
    res.redirect('/login');
  }
});

// middle ware to serve static files
app.use('/client', express.static(__dirname + '/client'));


// function to return the 404 message and error to client
app.get('*', function(req, res) {
  res.send("Error 404.");
});
