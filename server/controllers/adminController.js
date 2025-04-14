// // server/controllers/adminController.js
// import db from "../config/db.js";

// // Get All Users
// export const getAllUsers = (req, res) => {
//   const sql = "SELECT id, name, email, balance FROM users";
//   db.query(sql, (err, results) => {
//     if (err) return res.status(500).json({ message: "Database error", error: err });

//     res.json(results);
//   });
// };

// // Update User Balance (Admin Only)
// export const updateUserBalance = (req, res) => {
//   const { userId, balance } = req.body;

//   const sql = "UPDATE users SET balance = ? WHERE id = ?";
//   db.query(sql, [balance, userId], (err, result) => {
//     if (err) return res.status(500).json({ message: "Database error", error: err });

//     res.json({ message: "User balance updated successfully" });
//   });
// };


// server/controllers/adminController.js
import pool from "../config/db.js"; // Import the pool

// Get All Users (Selecting relevant fields)
export const getAllUsers = async (req, res) => { // Added async
  try {
    // Select columns relevant for an admin overview, exclude sensitive data like password hash
    const sql = "SELECT id, email, first_name, last_name, role, status, created_at, is_email_verified FROM users ORDER BY created_at DESC";
    const [results] = await pool.query(sql); // <-- Use pool.query
    res.json(results);
  } catch (err) {
    console.error("❌ Database error getting all users:", err);
    res.status(500).json({ message: "Error fetching users." });
  }
};


// Update User Balance (OBSOLETE - Balance is on accounts table)
// Keeping the function structure refactored but commenting out the core logic
// This endpoint should likely be removed or repurposed for other admin actions on users.
export const updateUserBalance = async (req, res) => { // Added async
    console.warn("⚠️ WARNING: updateUserBalance controller called - this function is obsolete as balance resides in the 'accounts' table.");
    // const { userId, balance } = req.body;

    return res.status(400).json({ message: "This function (updateUserBalance) is obsolete and should not be used. Balance is managed in the 'accounts' table." });

    /* // Original logic commented out - DO NOT USE
    try {
        const sql = "UPDATE users SET balance = ? WHERE id = ?"; // This won't work - no 'balance' column
        const [result] = await pool.query(sql, [balance, userId]);

        if (result.affectedRows === 0) {
             return res.status(404).json({ message: "User not found for balance update." });
        }
        res.json({ message: "User balance update attempted (OBSOLETE FUNCTION)." });

    } catch (err) {
        console.error("❌ Database error attempting obsolete balance update:", err);
        res.status(500).json({ message: "Error attempting obsolete balance update." });
    }
    */
};

// --- ADD NEW ADMIN CONTROLLER FUNCTIONS HERE LATER ---
// e.g., getPendingUsers, approveUser, blockUser, etc.