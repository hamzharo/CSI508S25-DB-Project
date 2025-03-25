// server/controllers/adminController.js
import db from "../config/db.js";

// Get All Users
export const getAllUsers = (req, res) => {
  const sql = "SELECT id, name, email, balance FROM users";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });

    res.json(results);
  });
};

// Update User Balance (Admin Only)
export const updateUserBalance = (req, res) => {
  const { userId, balance } = req.body;

  const sql = "UPDATE users SET balance = ? WHERE id = ?";
  db.query(sql, [balance, userId], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });

    res.json({ message: "User balance updated successfully" });
  });
};
