var mysql      = require('mysql2');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'jgboard',
  dateStrings: 'date' 
});
 
connection.connect();
 
// connection.end();

module.exports = {
  connection,
}