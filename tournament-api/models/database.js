const mysql = require("mysql");
const env_variables = require("../env_variables.js");
const conn = mysql.createConnection({
	host: env_variables.DATABASE.HOST,
	user: env_variables.DATABASE.USER,
	password: env_variables.DATABASE.PASSWORD,
	database: env_variables.DATABASE.DBNAME,
});

class Database {}

module.exports = Database;