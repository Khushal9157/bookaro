const { Pool } = require("pg");

module.exports = new Pool({
    user: "admin",
    password: "admin",
    host: "localhost",
    port: 5432,
    database: "tickets",
});
