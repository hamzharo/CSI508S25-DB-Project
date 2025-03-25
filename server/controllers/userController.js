// server/controllers/userController.js
import db from "../config/db.js";

// Get User Profile
export const getUserProfile = (req, res) => {
  const userId = req.user.id;
  
  const sql = "SELECT id, name, email, balance FROM users WHERE id = ?";
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });

    if (results.length === 0) return res.status(404).json({ message: "User not found" });

    res.json(results[0]);
  });
};

// Update User Profile
export const updateUserProfile = (req, res) => {
  const userId = req.user.id;
  const { name, email } = req.body;

  const sql = "UPDATE users SET name = ?, email = ? WHERE id = ?";
  db.query(sql, [name, email, userId], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });

    res.json({ message: "Profile updated successfully" });
  });
};
