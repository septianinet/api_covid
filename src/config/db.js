const Pool = require("pg").Pool;
const pool = new Pool({
  user: "me",
  host: "localhost",
  database: "api_covid",
  password: "password",
  port: 5432,
});

module.exports = {
  query: (query, params) => pool.query(query, params),
};
