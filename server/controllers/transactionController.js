// // server/controllers/transactionController.js
// import db from "../config/db.js";

// // Get User Transactions
// export const getTransactions = (req, res) => {
//   const userId = req.user.id;

//   const sql = "SELECT * FROM transactions WHERE sender_id = ? OR receiver_id = ? ORDER BY date DESC";
//   db.query(sql, [userId, userId], (err, results) => {
//     if (err) return res.status(500).json({ message: "Database error", error: err });

//     res.json(results);
//   });
// };

// // Transfer Funds
// export const transferFunds = (req, res) => {
//   const { senderId, receiverId, amount } = req.body;

//   // Validate amount
//   if (amount <= 0) return res.status(400).json({ message: "Invalid transfer amount" });

//   // Get sender's balance
//   db.query("SELECT balance FROM users WHERE id = ?", [senderId], (err, results) => {
//     if (err) return res.status(500).json({ message: "Database error", error: err });

//     if (results.length === 0) return res.status(404).json({ message: "Sender not found" });

//     const senderBalance = results[0].balance;

//     if (senderBalance < amount) return res.status(400).json({ message: "Insufficient balance" });

//     // Perform transaction
//     const sqlTransfer = `
//       UPDATE users SET balance = balance - ? WHERE id = ?;
//       UPDATE users SET balance = balance + ? WHERE id = ?;
//       INSERT INTO transactions (sender_id, receiver_id, amount, date) VALUES (?, ?, ?, NOW());
//     `;

//     db.query(sqlTransfer, [amount, senderId, amount, receiverId, senderId, receiverId, amount], (err, result) => {
//       if (err) return res.status(500).json({ message: "Transaction failed", error: err });

//       res.json({ message: "Transaction successful" });
//     });
//   });
// };


// server/controllers/transactionController.js
import pool from "../config/db.js"; // Import the pool

// Get Transactions for the Logged-in User's Accounts
export const getTransactions = async (req, res) => { // Added async
  const userId = req.user.id; // Assumes authMiddleware adds req.user

  try {
    // Find accounts belonging to the user first
    const getAccountsSql = "SELECT id FROM accounts WHERE user_id = ?";
    const [accounts] = await pool.query(getAccountsSql, [userId]);

    if (accounts.length === 0) {
      // It's okay if a user has no accounts yet
      return res.json([]);
    }

    // Get IDs of the user's accounts
    const accountIds = accounts.map(acc => acc.id);

    // Query transactions where the user's account is involved
    // Using account_id, sender_account_id, or receiver_account_id
    const getTransactionsSql = `
            SELECT * FROM transactions
            WHERE account_id IN (?)
               OR sender_account_id IN (?)
               OR receiver_account_id IN (?)
            ORDER BY timestamp DESC
        `;
    // We need to pass the array of IDs three times for the IN clauses
    const [transactions] = await pool.query(getTransactionsSql, [accountIds, accountIds, accountIds]);

    res.json(transactions);

  } catch (err) {
    console.error("❌ Database error getting transactions:", err);
    res.status(500).json({ message: "Error fetching transaction history." });
  }
};

// Transfer Funds (Refactored for Pool, Accounts, DB Transactions)
export const transferFunds = async (req, res) => { // Added async
  // Get sender user ID from verified token
  const senderUserId = req.user.id;
  // Get receiver account number and amount from request body
  const { receiverAccountNumber, amount } = req.body;

  // Validate amount
  const transferAmount = parseFloat(amount);
  if (isNaN(transferAmount) || transferAmount <= 0) {
    return res.status(400).json({ message: "Invalid transfer amount." });
  }

  // Validate receiver account number presence
  if (!receiverAccountNumber) {
      return res.status(400).json({ message: "Receiver account number is required." });
  }

  let connection; // Declare connection outside try block

  try {
    // Get a connection from the pool for transaction
    connection = await pool.getConnection();
    await connection.beginTransaction(); // Start transaction

    // --- Find Sender's Primary Account and Balance ---
    // Simplified: Assuming first account found for user is the one to use
    // Consider adding logic to select specific sender account if needed
    const findSenderAccountSql = "SELECT id, balance, status FROM accounts WHERE user_id = ? LIMIT 1";
    const [senderAccounts] = await connection.query(findSenderAccountSql, [senderUserId]);

    if (senderAccounts.length === 0) {
      await connection.rollback(); // Rollback transaction
      connection.release();       // Release connection
      return res.status(404).json({ message: "Sender account not found." });
    }
    const senderAccount = senderAccounts[0];
    const senderAccountId = senderAccount.id;

    // Check sender account status
    if (senderAccount.status !== 'active') {
        await connection.rollback();
        connection.release();
        return res.status(403).json({ message: "Sender account is not active." });
    }

    // Check sufficient balance
    const senderBalance = parseFloat(senderAccount.balance);
    if (senderBalance < transferAmount) {
      await connection.rollback();
      connection.release();
      return res.status(400).json({ message: "Insufficient balance." });
    }

    // --- Find Receiver's Account by Account Number ---
    const findReceiverAccountSql = "SELECT id, status FROM accounts WHERE account_number = ?";
    const [receiverAccounts] = await connection.query(findReceiverAccountSql, [receiverAccountNumber]);

    if (receiverAccounts.length === 0) {
      await connection.rollback();
      connection.release();
      return res.status(404).json({ message: "Receiver account number not found." });
    }
    const receiverAccount = receiverAccounts[0];
    const receiverAccountId = receiverAccount.id;

     // Check receiver account status
    if (receiverAccount.status !== 'active') {
        await connection.rollback();
        connection.release();
        return res.status(403).json({ message: "Receiver account is not active." });
    }

    // Prevent transferring to the same account
    if (senderAccountId === receiverAccountId) {
         await connection.rollback();
         connection.release();
         return res.status(400).json({ message: "Cannot transfer funds to the same account." });
    }

    // --- Perform Updates within Transaction ---
    // 1. Deduct from sender
    const deductSql = "UPDATE accounts SET balance = balance - ? WHERE id = ? AND balance >= ?"; // Add balance check for safety
    const [deductResult] = await connection.query(deductSql, [transferAmount, senderAccountId, transferAmount]);
    if (deductResult.affectedRows === 0) {
         // This could happen in a race condition if balance changed after initial check
         await connection.rollback();
         connection.release();
         return res.status(400).json({ message: "Insufficient balance or sender account error." });
    }


    // 2. Add to receiver
    const addSql = "UPDATE accounts SET balance = balance + ? WHERE id = ?";
    await connection.query(addSql, [transferAmount, receiverAccountId]);

    // 3. Log the transaction
    const logTransactionSql = `
            INSERT INTO transactions (type, amount, status, account_id, sender_account_id, receiver_account_id, description)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
    const description = `Transfer to account ${receiverAccountNumber}`;
    await connection.query(logTransactionSql, [
      'transfer', transferAmount, 'completed', senderAccountId, // account_id = primary account involved (sender)
      senderAccountId, receiverAccountId, description
    ]);

    // --- Commit Transaction ---
    await connection.commit();
    console.log(`✅ Transfer successful: Account ${senderAccountId} -> Account ${receiverAccountId}, Amount: ${transferAmount}`);
    res.json({ message: "Transaction successful" });

  } catch (err) {
    console.error("❌ Transaction failed:", err);
    // If connection exists and an error occurred, rollback
    if (connection) {
      try {
          await connection.rollback();
          console.log("Transaction rolled back.");
      } catch (rollbackError) {
          console.error("❌ Error rolling back transaction:", rollbackError);
      }
    }
    res.status(500).json({ message: "Transaction failed.", error: err.message });
  } finally {
    // Ensure the connection is always released back to the pool
    if (connection) {
      connection.release();
      console.log("DB Connection Released after transfer attempt.");
    }
  }
};