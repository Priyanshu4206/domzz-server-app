const mysql = require("mysql");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Team7",
  database: "DomzzSite",
});
module.exports = db;
