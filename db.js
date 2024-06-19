var mysql = require("mysql2");

var connection = mysql.createConnection({
  // host: "localhost",
  host: "host.docker.internal",
  user: "root",
  port: 3307,
  password: "root",
  database: "jgboard",
  dateStrings: "date",
});

connection.connect();

// connection.end();

module.exports = {
  connection,
};
