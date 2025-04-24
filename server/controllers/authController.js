// server/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js"; // <--- Import the pool
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import crypto from 'crypto';

dotenv.config();

// Optional: Placeholder for potential "resend verification" feature
// export const sendVerificationEmail = async (req, res) => { /* ... */ };

// =============================================
//  Register User Function (Refactored for Pool)
// =============================================
export const register = async (req, res) => { // <-- Added async
  // 1. Destructure fields
  const {
    email, password, firstName, lastName, dob, citizenship, ssn, gender,
    phone, address, street, apt, city, country, zip, localAddressSame
  } = req.body;

  // 2. Basic Validation
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ message: "Missing required fields (Email, Password, First Name, Last Name)." });
  }

  try {
    // 3. Check if email already exists using the pool
    const checkEmailSql = "SELECT id FROM users WHERE email = ?";
    const [resultsCheck] = await pool.query(checkEmailSql, [email]); // <-- Use pool.query with await

    if (resultsCheck.length > 0) {
      return res.status(409).json({ message: "Email address is already registered." });
    }

    // 4. Hash password (using async version of bcrypt hash)
    const hashedPassword = await bcrypt.hash(password, 10); // <-- Use await with bcrypt's promise

    // 5. Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // 7. Prepare SQL INSERT statement
    const insertSql = `
      INSERT INTO users (
          email, password, first_name, last_name, dob, citizenship, ssn, gender,
          phone, address, street, apt, city, country, zip, local_address_same,
          role, status, is_email_verified, email_verification_token, email_token_expires
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      email, hashedPassword, firstName, lastName, dob || null, citizenship || null,
      ssn || null, gender || null, phone || null, address || null, street || null,
      apt || null, city || null, country || null, zip || null, localAddressSame === true,
      'customer', 'pending_email_verification', false, verificationToken, tokenExpiry
    ];

    // 8. Execute Insert Query using the pool
    const [result] = await pool.query(insertSql, values); // <-- Use pool.query with await
    console.log(` User registered successfully with ID: ${result.insertId}`);

    // 9. Send Verification Email (nodemailer part remains largely the same)
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn(" Email credentials missing. Skipping verification email.");
      return res.status(201).json({ message: "Registration successful. Email verification step skipped due to server config." });
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const verificationLink = `${frontendUrl}/verify-email?token=${verificationToken}`;
    console.log("📧 Attempting to send verification email to:", email);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });
    const mailOptions = {
      from: `"Online Bank" <${process.env.EMAIL_USER}>`, to: email,
      subject: "Verify Your Email Address for Online Bank",
      text: `Click link to verify: ${verificationLink} (Expires in 1 hour)`,
      html: `<p>Thank you for registering...</p><p><a href="${verificationLink}">Verify Email Address</a></p><p>Expires in <strong>1 hour</strong>.</p>`,
    };

    // Send mail using async/await with nodemailer if preferred, or keep callback
    transporter.sendMail(mailOptions, (mailErr, info) => {
      if (mailErr) {
        console.error(" Error sending verification email. Details:", mailErr);
        // Still 201 as user was created, but inform about email failure
        return res.status(201).json({
          message: "Registration successful, but the verification email could not be sent. Please contact support.",
          error: "Failed to send verification email."
        });
      }
      console.log(" Verification email sent:", info.response);
      res.status(201).json({
        message: "Registration successful! Please check your email inbox (and spam folder) to verify your account."
      });
    });

  } catch (err) { // <-- Catch errors from await blocks
    console.error(" Error during registration process:", err);
    // Check for specific DB errors if needed (e.g., err.code === 'ER_DUP_ENTRY')
    res.status(500).json({ message: "Error processing registration." });
  }
}; // End register function

// =============================================
// Login Function (Refactored for Pool & Status Check)
// =============================================
export const login = async (req, res) => { // <-- Added async
  const { email, password } = req.body;

  // TODO: Add input validation

  try {
    const sql = "SELECT * FROM users WHERE email = ?";
    const [results] = await pool.query(sql, [email]); // <-- Use pool.query with await

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const user = results[0];

    // --- Status Check ---
    if (user.status !== 'active') {
      let reason = 'Login failed. Account is not active.';
      if (user.status === 'pending_email_verification') reason = 'Account not yet active. Please verify your email address first.';
      else if (user.status === 'pending_approval') reason = 'Account verification successful, but pending administrator approval.';
      else if (user.status === 'inactive' || user.status === 'blocked') reason = 'Account has been suspended or blocked. Please contact support.';
      console.warn(`Login attempt failed for inactive user: ${user.email}, Status: ${user.status}`);
      return res.status(403).json({ message: reason });
    }
    // --- End Status Check ---

    // Compare passwords using bcrypt's async version
    const isMatch = await bcrypt.compare(password, user.password); // <-- Use await

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // --- If login is successful ---
    const payload = { id: user.id, role: user.role };
    const secret = process.env.JWT_SECRET;
    const options = { expiresIn: "1h" };

    if (!secret) {
      console.error('FATAL ERROR: JWT_SECRET is not defined.');
      return res.status(500).json({ message: "Server configuration error." });
    }

    // Use await for jwt.sign if using a promise-based wrapper, or keep callback
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.error('Error signing JWT:', err);
        return res.status(500).json({ message: 'Error generating session.' });
      }
      res.json({
        token,
        user: { id: user.id, email: user.email, role: user.role, firstName: user.first_name }
      });
    });

  } catch (err) { // <-- Catch errors from await blocks
    console.error("Error during login process:", err);
    res.status(500).json({ message: "Error logging in." });
  }
}; // End login function


// =============================================
// ✅ Email Verification Token Handler (Refactored for Pool)
// =============================================
export const verifyEmailToken = async (req, res) => { // <-- Added async
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ message: "Verification token is required." });
  }

  try {
    // 2. Find the user with this token
    const findTokenSql = `
      SELECT id, status FROM users
      WHERE email_verification_token = ? AND email_token_expires > NOW() AND status = 'pending_email_verification'
    `;
    const [results] = await pool.query(findTokenSql, [token]); // <-- Use pool.query

    // 3. Check if found
    if (results.length === 0) {
      const checkExpiredSql = "SELECT id FROM users WHERE email_verification_token = ?";
      const [expiredResults] = await pool.query(checkExpiredSql, [token]); // <-- Use pool.query

      if (expiredResults.length > 0) {
        return res.status(400).json({ message: "Verification link has expired or is invalid. Please request a new one." });
      } else {
        return res.status(404).json({ message: "Invalid verification token." });
      }
    }

    // 4. Update the user
    const user = results[0];
    const userId = user.id;
    const updateSql = `
      UPDATE users SET is_email_verified = TRUE, status = 'pending_approval',
      email_verification_token = NULL, email_token_expires = NULL, updated_at = NOW()
      WHERE id = ? AND status = 'pending_email_verification'
    `;
    const [updateResult] = await pool.query(updateSql, [userId]); // <-- Use pool.query

    if (updateResult.affectedRows === 0) {
      console.warn(` User ${userId} status update affected 0 rows during verification...`);
      return res.status(400).json({ message: "Could not verify email at this time." });
    }

    console.log(` Email verified for user ID: ${userId}. Status set to pending_approval.`);
    res.json({ message: "Email verified successfully! Your account is now pending administrator approval." });

  } catch (err) { // <-- Catch errors from await blocks
    console.error(" Error during email token verification:", err);
    return res.status(500).json({ message: "Error verifying email token." });
  }
}; // End verifyEmailToken function