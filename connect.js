var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "username",
  password: "password",
  database: "group28"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  //SQL stuff
});
