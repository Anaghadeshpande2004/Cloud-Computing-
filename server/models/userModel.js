const pool = require("../database/connection");
const bcrypt = require("bcryptjs");
const { generateAccessAndRefreshToken } = require("../utils/token");

exports.register = (email, password, isAdmin, fname, lname) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      (err, results) => {
        if (err) {
          console.error("MySQL SELECT Error:", err);
          return reject(err);
        }

        if (results.length > 0) {
          return reject(new Error("User already exists"));
        }

        // Hash password
        bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
          if (hashErr) {
            console.error("Hashing Error:", hashErr);
            return reject(hashErr);
          }

          // Store hashed password (don't truncate it!)
          const query = `
                    INSERT INTO users (email, password, isAdmin, fname, lname)
                    VALUES (?, ?, ?, ?, ?)
                `;

          pool.query(
            query,
            [email, hashedPassword, isAdmin, fname, lname],
            (insertErr, result) => {
              if (insertErr) {
                console.error("MySQL INSERT Error:", insertErr);
                return reject(insertErr);
              }
              console.log("User registered successfully");
              resolve(result);
            }
          );
        });
      }
    );
  });
};

exports.login = (email, password) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT userId, password, isAdmin FROM users WHERE email = ?",
      [email],
      (err, result) => {
        if (err) {
          console.error("Login SELECT Error:", err);
          return reject(err);
        }

        if (result.length === 0) {
          return reject(new Error("Invalid email or password"));
        }

        const storedHashedPassword = result[0].password;
        bcrypt.compare(
          password,
          storedHashedPassword,
          (compareErr, isMatch) => {
            if (compareErr) {
              console.error("Password Compare Error:", compareErr);
              return reject(compareErr);
            }

            if (!isMatch) {
              return reject(new Error("Invalid email or password"));
            }

            const userData = {
              userId: result[0].userId,
              isAdmin: result[0].isAdmin,
            };

            const { token, refreshToken } =
              generateAccessAndRefreshToken(userData);
            userData.token = token;
            userData.refreshToken = refreshToken;

            resolve([userData]);
          }
        );
      }
    );
  });
};
