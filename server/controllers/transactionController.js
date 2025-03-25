// server/controllers/transactionController.js
import db from "../config/db.js";

// Get User Transactions
export const getTransactions = (req, res) => {
  const userId = req.user.id;

  const sql = "SELECT * FROM transactions WHERE sender_id = ? OR receiver_id = ? ORDER BY date DESC";
  db.query(sql, [userId, userId], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });

    res.json(results);
  });
};

// Transfer Funds
export const transferFunds = (req, res) => {
  const { senderId, receiverId, amount } = req.body;

  // Validate amount
  if (amount <= 0) return res.status(400).json({ message: "Invalid transfer amount" });

  // Get sender's balance
  db.query("SELECT balance FROM users WHERE id = ?", [senderId], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });

    if (results.length === 0) return res.status(404).json({ message: "Sender not found" });

    const senderBalance = results[0].balance;

    if (senderBalance < amount) return res.status(400).json({ message: "Insufficient balance" });

    // Perform transaction
    const sqlTransfer = `
      UPDATE users SET balance = balance - ? WHERE id = ?;
      UPDATE users SET balance = balance + ? WHERE id = ?;
      INSERT INTO transactions (sender_id, receiver_id, amount, date) VALUES (?, ?, ?, NOW());
    `;

    db.query(sqlTransfer, [amount, senderId, amount, receiverId, senderId, receiverId, amount], (err, result) => {
      if (err) return res.status(500).json({ message: "Transaction failed", error: err });

      res.json({ message: "Transaction successful" });
    });
  });
};
