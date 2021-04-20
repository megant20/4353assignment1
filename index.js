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
module.exports = app.listen(process.env.PORT || 9001, () => console.log('Listening on port 9001!'));

app.get('/',function(req, res) {
  res.sendFile(__dirname + '/client/landingpage.html');
});

app.get('/quoteOutput', function(req, res)
{
	console.log("loaded quote page");
	res.sendFile(__dirname + '/client/quoteOutput.html');
});

// // GET method route for getClientInfoDatabase page.
// Grab user's information to use for fuelquotehistory
app.get('/getClientAddress',function(req, res) {
  con.query('SELECT * FROM clientInformation WHERE username = ?', req.session.username, function(err,result,fields) {
    if (err) throw err;
    if (result.length == 0) {
      console.log("No entries in accounts table");
    } else { // Send Accounts table
      var fullAddress = result[0].addressLine1;

	  if (result[0].addressLine2 != '')
	  {
		  fullAddress += (', ' + result[0].addressLine2);
	  }

	  fullAddress += (', ' + result[0].city + ', ' + result[0].state + ' ' + result[0].zipMain);

	  if (result[0].zipPlus4 != '')
	  {
		  fullAddress += ('-' + result[0].zipPlus4);
	  }

	  res.send(fullAddress);
    }
  });
});

app.get('/getAddy1',function(req, res) {
  con.query('SELECT * FROM clientInformation WHERE username = ?', req.session.username, function(err,result,fields){
    if (err) throw err;
    if (result.length == 0) {
      console.log("No entries in accounts table");
    } else {
      var addy1 = result[0].addressLine1;

      res.send(addy1);
    }
  });
});

app.get('/getAddy2',function(req, res) {
  con.query('SELECT * FROM clientInformation WHERE username = ?', req.session.username, function(err,result,fields){
    if (err) throw err;
    if (result.length == 0) {
      console.log("No entries in accounts table");
    } else {
      var addy2 = result[0].addressLine2;

      res.send(addy2);
    }
  });
});

app.get('/getCity',function(req, res) {
  con.query('SELECT * FROM clientInformation WHERE username = ?', req.session.username, function(err,result,fields){
    if (err) throw err;
    if (result.length == 0) {
      console.log("No entries in accounts table");
    } else {
      var city1 = result[0].city;

      res.send(city1);
    }
  });
});

app.get('/getState',function(req, res) {
  con.query('SELECT * FROM clientInformation WHERE username = ?', req.session.username, function(err,result,fields){
    if (err) throw err;
    if (result.length == 0) {
      console.log("No entries in accounts table");
    } else {
      var state1 = result[0].state;

      res.send(state1);
    }
  });
});

app.get('/getZipMain',function(req, res) {
  con.query('SELECT * FROM clientInformation WHERE username = ?', req.session.username, function(err,result,fields){
    if (err) throw err;
    if (result.length == 0) {
      console.log("No entries in accounts table");
    } else {
      var zip1 = result[0].zipMain;

      res.send(zip1);
    }
  });
});

app.get('/getZipPlus',function(req, res) {
  con.query('SELECT * FROM clientInformation WHERE username = ?', req.session.username, function(err,result,fields){
    if (err) throw err;
    if (result.length == 0) {
      console.log("No entries in accounts table");
    } else {
      var zip2 = result[0].zipPlus4;

      res.send(zip2);
    }
  });
});

app.get('/getFullName',function(req, res) {
  con.query('SELECT * FROM clientInformation WHERE username = ?', req.session.username, function(err,result,fields){
    if (err) throw err;
    if (result.length == 0) {
      console.log("No entries in accounts table");
    } else {
      var fullName = result[0].fullname;

      res.send(fullName);
    }
  });
});

app.get('/getClientInfo', function(req, res)
{
	con.query('SELECT * FROM clientInformation WHERE username = ?', req.session.username, function(error, result, fields)
	{
		if (error) throw error;
		if (result.length == 0)
		{
			console.log('User not found');
		}
		else
		{
			res.send(result[0]);
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

// POST method to save request details
app.post('/saveRequest', function(req, res)
{
	var user = req.session.username;
	var reqAmount = req.body.gallons;
	var addr = req.body.address;
	var date = new Date(req.body.d_date);

	if (user && reqAmount && addr && date)
	{
		var query = "INSERT INTO group28.fuelQuote (username, gallonsRequested, address, deliveryDate) VALUES (";// + user +"', '" + reqAmount + "', '" + addr + "', '" + date + "');";

		//date from form is treated as UTC. JS converts that to local time. Need to convert back to get proper date
		var x = new Date();
		var offset = x.getTimezoneOffset() / 60;

		addHours(date, offset);

		con.query(query + "?, ?, ?, ?);", [user, reqAmount, addr, date], function(error, result)
		{
			if (error) { throw error; }

			console.log('saved request');
			res.redirect('/quoteOutput');
		});
	}
	else
	{
		console.log("save failed");
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
          res.status(201);
          req.session.loggedin = true;
          req.session.username = userName;
          req.session.login = userName;
          res.redirect('/completeprofile');
        });
      } else{
        console.log("user EXISTS!");
        res.send('user already exists!');
        res.status(400);
      }
		});
    } else {
      console.log("Invalid UserData: one or more entries are missing!");
      res.send("Invalid UserData: one or more entries are missing!")
      res.status(400);
    }
});

app.post('/editProfile', function(req, res) {
    var fullName = req.body.fullname2;
    var addy1 = req.body.addressline12;
    var addy2 = req.body.addressline22;
    var ncity = req.body.city2;
    var state = req.body.state2;
    var zipmain = req.body.zipmain2;
    var zipfour = req.body.zipplusfour2;

    var username = 	req.session.username;
    console.log(username)
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
            zipPlus4: zipfour,
            fullName: fullName
          };
        con.query('DELETE FROM clientInformation WHERE username = ?', username, function(er, ress) {
          if (er) {
            throw er;
          }
          console.log("Value deleted")
        });
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

app.post('/newProfile', function(req, res) {
    var fullName = req.body.fullname;
    var addy1 = req.body.addressline1;
    var addy2 = req.body.addressline2;
    var ncity = req.body.city;
    var state = req.body.state;
    var zipmain = req.body.zipmain;
    var zipfour = req.body.zipplusfour;

    var username = req.session.username;
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
            zipPlus4: zipfour,
            fullName: fullName
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
        console.log("ERROR");
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




// GET Method for generating fuel quotes
app.get('/generateQuote', function(req, res) {
	//console.log("got here");
	var userName = req.session.username;
	var requestedAmount = 0.0;
	var inState = false;
	var queryString = '';
	var msg = '';
	var multiplier = 1.0;
	var regTotal = 0.0;
	var basePriceOut = 2.5;
	var adjPriceOut = 0.0;
	var totalPriceOut = 0.0;
	var addr = '';
	var delivDate = new Date();
	var name = '';

	var ourState = 'TX';

	if (userName)
	{
		// set inState
		queryString = 'SELECT * FROM clientInformation WHERE username = ?';
		con.query(queryString, [userName], function(error, results, fields)
		{
			if (results.length > 0)
			{
				inState = (results[0].state == ourState);
				if (!inState)
				{
					multiplier = 1.15;
				}

				console.log('multiplier set');
			}
			else
			{
				msg = 'User not found'; // shouldn't actually happen

				console.log(msg);
				res.send(msg);
			}
		});

		// fetch query details
		queryString = 'SELECT * FROM group28.fuelQuote WHERE username = ? ORDER BY id DESC;';
		con.query(queryString, [userName], function (error, result, fields)
		{
			if (result.length > 0)
			{
				console.log(result[0]);
				console.log('fetched quote details');

				requestedAmount = result[0].gallonsRequested;
				addr = result[0].address;
				delivDate = result[0].deliveryDate;
			}
			else
			{
				res.send('request not found');
				return;
			}
		});

		queryString = 'SELECT gallonsRequested, totalDue FROM fuelQuote';
		con.query(queryString, function(error, results, fields)
		{
			if (results.length > 0)
			{
				var a = linearRegression(results, false);
				var b = linearRegression(results, true);

				console.log('performed regression');

				regTotal = b * requestedAmount + a;

				if (regTotal == -1.0)	//	no data found
				{
					adjPriceOut = multiplier * basePriceOut;
					totalPriceOut = adjPriceOut * requestedAmount;
				}
				else
				{
					basePriceOut = regTotal / requestedAmount;
					adjPriceOut = basePriceOut * multiplier;
					totalPriceOut = adjPriceOut * requestedAmount;
				}
			}
			else
			{
				adjPriceOut = multiplier * basePriceOut;
				totalPriceOut = adjPriceOut * gallonsRequested;
			}

			var dateStr = delivDate.getFullYear() + '-' + pad(delivDate.getMonth() + 1, 2, '0') + '-' + pad(delivDate.getDate(), 2, '0');
			var outRes = {
				gallonsRequested: requestedAmount,
				address: addr,
				deliveryDate: dateStr,
				adjUnitPrice:  adjPriceOut.toFixed(2),
				totalDue: totalPriceOut.toFixed(2)
			};

			res.send(outRes);
		});
	}
	else
	{
		msg = 'You must be logged in';

		console.log(msg);
		res.send(msg);
	}
});

function linearRegression(data, returnSlope)
{
	var i;
	var sumY = 0.0;
	var sumXSq = 0.0;
	var sumX = 0.0;
	var sumXY = 0.0;
	var n = data.length;

	if (n > 0)
	{
		for (i = 0; i < n; i++)
		{
			sumY += data[i].totalDue;
			sumXSq += Math.pow(data[i].gallonsRequested, 2.0);
			sumX += data[i].gallonsRequested;
			sumXY += data[i].gallonsRequested * data[i].totalDue;
		}

		if (returnSlope)
		{
			return (n * sumXY - sumX * sumY) / (n * sumXSq - Math.pow(sumX, 2.0));
		}
		else
		{
			return (sumY * sumXSq - sumX * sumXY) / (n * sumXSq - Math.pow(sumX, 2.0));
		}
	}
	else
	{
		return -1.0;
	}
}

function addHours(baseDate, hours)
{
	baseDate.setTime(baseDate.getTime() + (hours * 60 * 60 * 1000));

	return baseDate;
}

function pad(num, spaces, padChar)
{
	num = num.toString();

	while(num.length < spaces)
	{
		num = padChar + num;
	}

	return num;
}

// function to return the 404 message and error to client
app.get('*', function(req, res) {
  res.send("Error 404.");
});
