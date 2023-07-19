const { pool } = require("../database/db");

const bcrypt = require("bcryptjs");
exports.signup = (req, res) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.json({ error: "Error hashing password" });
    }
    const sql =
      "INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *";
    const values = [req.body.name, hash, req.body.email.toLowerCase()];
    pool
      .query(sql, values)
      .then((data) => {
        res.json({ data: data.rows[0] });
      })
      .catch((err) => {
        if (err.constraint === "users_email_key") {
          res.status(400).json({ error: "Email already exists" });
        } else {
          res.status(700).json({ error: "Server error" });
        }
      });
  });
};
exports.login = (req, res) => {
  const sql = "SELECT id, * FROM users WHERE username = $1 OR email = $1"; // Include id in the SELECT statement
  const values = [req.body.name];
  pool
    .query(sql, values)
    .then((data) => {
      if (data.rows.length > 0) {
        const user = data.rows[0];
        bcrypt.compare(req.body.password, user.password, (err, result) => {
          if (result) {
            res.json({ data: { id: user.id } }); // Return the ID only in the response
          } else {
            res.status(401).json({ error: "Invalid password" });
          }
        });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: "Server error" });
    });
};
