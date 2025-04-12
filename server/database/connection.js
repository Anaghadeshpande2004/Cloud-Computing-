const mysql2 = require("mysql2");
require('dotenv').config();

let connectionParams;

const useLocalhost = process.env.USE_LOCALHOST === 'true';

if (useLocalhost) {
    console.log("Inside local")
    connectionParams = {
        user: "root",
        host: "localhost",
        password: "",
        database: "railway",   // ✅ must match local DB
    };
} else {
    connectionParams = {
        user: process.env.DB_SERVER_USER,
        host: process.env.DB_SERVER_HOST,
        password: process.env.DB_SERVER_PASSWORD,
        database: process.env.DB_SERVER_DATABASE,  // ✅ 'railway' or 'ecommerce'
    };
}

const pool = mysql2.createConnection(connectionParams);

pool.connect((err) => {
    if (err) console.log(err.message);
    else console.log("DB Connection Done")
});

module.exports = pool;
