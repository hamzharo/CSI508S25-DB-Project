// server/controllers/adminController.js
import pool from "../config/db.js"; // Import the pool
import { generateAccountNumber } from "../utils/accountUtils.js"; // Import the account number generator

// --- Get Pending Users ---
export const getPendingUsers = async (req, res) => { // Added async
  try {  
    // Select users waiting for approval, showing relevant details
    const sql = `
            SELECT id, email, first_name, last_name, created_at, is_email_verified
            FROM users
            WHERE status = 'pending_approval'
            ORDER BY created_at ASC
        `;
    const [pendingUsers] = await pool.query(sql); // <-- Use pool.query
    res.json(pendingUsers);
  } catch (err) {
    console.error("❌ Database error getting pending users:", err);
    res.status(500).json({ message: "Error fetching pending users." });
  }
};


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


// --- NEW: Approve User and Create Account ---
export const approveUser = async (req, res) => { // Added async
  const { userId } = req.params; // Get userId from route parameter

  if (!userId || isNaN(parseInt(userId))) {
      return res.status(400).json({ message: "Invalid User ID provided." });
  }
  const userIdInt = parseInt(userId);

  let connection; // For database transaction

  try {
    connection = await pool.getConnection(); // Get connection for transaction
    await connection.beginTransaction();   // Start transaction

    // 1. Check current user status (ensure they are pending approval)
    const checkStatusSql = "SELECT status FROM users WHERE id = ?";
    const [users] = await connection.query(checkStatusSql, [userIdInt]);

    if (users.length === 0) {
         await connection.rollback();
         connection.release();
         return res.status(404).json({ message: "User not found." });
    }
    if (users[0].status !== 'pending_approval') {
         await connection.rollback();
         connection.release();
         return res.status(400).json({ message: `User is not pending approval (Status: ${users[0].status}).` });
    }

    // 2. Update user status to 'active'
    const updateUserSql = "UPDATE users SET status = 'active', updated_at = NOW() WHERE id = ?";
    const [updateResult] = await connection.query(updateUserSql, [userIdInt]);

    if (updateResult.affectedRows === 0) {
        // Should not happen if check above passed, but safety check
        throw new Error(`Failed to update status for user ${userIdInt}.`);
    }

    // 3. Generate a unique account number
    // IMPORTANT: In production, add retry logic or a robust unique generation
    // strategy to handle potential account number collisions.
    let accountNumber;
    let accountExists = true;
    let attempts = 0;
    const maxAttempts = 5; // Limit attempts to prevent infinite loop

    while (accountExists && attempts < maxAttempts) {
        attempts++;
        accountNumber = generateAccountNumber();
        const checkAccountSql = "SELECT id FROM accounts WHERE account_number = ?";
        const [existingAccounts] = await connection.query(checkAccountSql, [accountNumber]);
        if (existingAccounts.length === 0) {
            accountExists = false;
        } else {
             console.warn(`Account number collision attempt ${attempts}: ${accountNumber}`);
        }
    }

    if (accountExists) { // Failed to generate unique number after several attempts
        throw new Error(`Could not generate a unique account number for user ${userIdInt} after ${maxAttempts} attempts.`);
    }


    // 4. Create a default 'Checking' account for the user
    const createAccountSql = `
            INSERT INTO accounts (user_id, account_number, account_type, balance, status)
            VALUES (?, ?, ?, ?, ?)
        `;
    await connection.query(createAccountSql, [
        userIdInt,          // user_id
        accountNumber,      // generated account_number
        'Checking',         // default account_type
        0.00,               // initial balance
        'active'            // account status
    ]);

    // 5. Commit the transaction
    await connection.commit();

    console.log(`✅ Admin approved User ID: ${userIdInt}. Status set to active. Account ${accountNumber} created.`);
    res.json({ message: "User approved successfully and initial account created.", accountNumber: accountNumber });

  } catch (err) {
    console.error(`❌ Error approving user ${userIdInt}:`, err);
    // Rollback transaction if an error occurs
    if (connection) {
      await connection.rollback();
    }
    res.status(500).json({ message: "Failed to approve user.", error: err.message });
  } finally {
    // Always release the connection
    if (connection) {
      connection.release();
      console.log("DB Connection Released after approval attempt.");
    }
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