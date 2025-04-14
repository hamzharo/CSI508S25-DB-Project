// // server/controllers/authController.js
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import db from "../config/db.js";
// import dotenv from "dotenv";
// import nodemailer from "nodemailer";
// import crypto from 'crypto';

// dotenv.config();

// // Optional: Placeholder for potential "resend verification" feature
// // export const sendVerificationEmail = (req, res) => { /* ... */ };

// // =============================================
// // ✅ Register User Function (Corrected & Working)
// // =============================================
// export const register = (req, res) => {
//   // 1. Destructure all expected fields from req.body
//   const {
//     email, password, firstName, lastName, dob, citizenship, ssn, gender,
//     phone, address, street, apt, city, country, zip, localAddressSame
//   } = req.body;

//   // 2. Basic Validation
//   if (!email || !password || !firstName || !lastName) {
//     return res.status(400).json({ message: "Missing required fields (Email, Password, First Name, Last Name)." });
//   }
//   // Add more validation (email format, password strength) here if needed

//   // 3. Check if email already exists
//   const checkEmailSql = "SELECT id FROM users WHERE email = ?";
//   db.query(checkEmailSql, [email], (errCheck, resultsCheck) => { // Uses resultsCheck
//     if (errCheck) {
//       console.error("❌ Error checking email:", errCheck);
//       return res.status(500).json({ message: "Database error during email check." });
//     }
//     // Check resultsCheck correctly
//     if (resultsCheck.length > 0) {
//       return res.status(409).json({ message: "Email address is already registered." }); // 409 Conflict
//     }

//     // If email doesn't exist, proceed to hash password
//     // 4. Hash password asynchronously
//     bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
//       if (hashErr) {
//         console.error("❌ Error hashing password:", hashErr);
//         return res.status(500).json({ message: "Error processing registration." });
//       }

//       // 5. Generate verification token
//       const verificationToken = crypto.randomBytes(32).toString('hex');

//       // 6. Set token expiry (1 hour from now)
//       const tokenExpiry = new Date(Date.now() + 3600000); // 1 hour in milliseconds

//       // 7. Prepare SQL INSERT statement
//       const insertSql = `
//         INSERT INTO users (
//             email, password, first_name, last_name, dob, citizenship, ssn, gender,
//             phone, address, street, apt, city, country, zip, local_address_same,
//             role, status, is_email_verified, email_verification_token, email_token_expires
//         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//       `;
//       const values = [
//         email, hashedPassword, firstName, lastName, dob || null, citizenship || null,
//         ssn || null, gender || null, phone || null, address || null,
//         street || null, apt || null, city || null, country || null,
//         zip || null, localAddressSame === true, // Ensure boolean interpretation
//         'customer',                     // Default role
//         'pending_email_verification',   // Initial status
//         false,                          // is_email_verified
//         verificationToken,              // The token
//         tokenExpiry                     // The expiry date/time
//       ];

//       // 8. Execute Insert Query
//       db.query(insertSql, values, (insertErr, result) => { // Uses result here
//         if (insertErr) {
//           console.error("❌ Error inserting user:", insertErr);
//           return res.status(500).json({ message: "Database error during registration." });
//         }
//         console.log(`✅ User registered successfully with ID: ${result.insertId}`);

//         // 9. Send Verification Email
//         if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
//              console.warn("⚠️ Email credentials not found in .env. Skipping verification email sending.");
//              return res.status(201).json({
//                  message: "Registration successful. Email verification step skipped due to server configuration issue.",
//                  warning: "Verification email could not be sent."
//              });
//         }
//         const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
//         const verificationLink = `${frontendUrl}/verify-email?token=${verificationToken}`;
//         console.log("📧 Attempting to send verification email to:", email);

//         const transporter = nodemailer.createTransport({
//           service: "gmail",
//           auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
//         });
//         const mailOptions = {
//           from: `"Online Bank" <${process.env.EMAIL_USER}>`,
//           to: email,
//           subject: "Verify Your Email Address for Online Bank",
//           text: `Thank you for registering with Online Bank. Please click the following link to verify your email address:\n\n${verificationLink}\n\nIf you did not request this, please ignore this email.\nThis link will expire in 1 hour.`,
//           html: `<p>Thank you for registering with Online Bank.</p><p>Please click the link below to verify your email address:</p><p><a href="${verificationLink}">Verify Email Address</a></p><p>If you did not request this, please ignore this email.</p><p>This link will expire in <strong>1 hour</strong>.</p>`,
//         };

//         transporter.sendMail(mailOptions, (mailErr, info) => {
//           if (mailErr) {
//             console.error("❌ Error sending verification email. Details:", mailErr);
//             return res.status(201).json({ // Still 201 because user was created
//                  message: "Registration successful, but the verification email could not be sent. Please contact support.",
//                  error: "Failed to send verification email."
//             });
//           }
//           console.log("✅ Verification email sent:", info.response);
//           res.status(201).json({
//             message: "Registration successful! Please check your email inbox (and spam folder) to verify your account."
//           });
//         }); // End sendMail
//       }); // End db.query INSERT callback
//     }); // End bcrypt.hash callback
//   }); // End db.query checkEmail callback
// }; // End register function

// // =============================================
// // Login Function (WITH Status Check Added)
// // =============================================
// export const login = (req, res) => {
//   const { email, password } = req.body;

//   // TODO: Enhance with validation

//   const sql = "SELECT * FROM users WHERE email = ?"; // Fetch all necessary fields including status
//   db.query(sql, [email], (err, results) => {
//     if (err) {
//         console.error("❌ Database error during login:", err);
//         return res.status(500).json({ message: "Error logging in." });
//     }
//     if (results.length === 0) {
//         return res.status(401).json({ message: "Invalid email or password." }); // Keep generic
//     }

//     const user = results[0];

//     // --- Status Check ---
//     if (user.status !== 'active') {
//       let reason = 'Login failed. Account is not active.'; // Default reason
//       if (user.status === 'pending_email_verification') {
//           reason = 'Account not yet active. Please verify your email address first.';
//       } else if (user.status === 'pending_approval') {
//           reason = 'Account verification successful, but pending administrator approval.';
//       } else if (user.status === 'inactive' || user.status === 'blocked') {
//           reason = 'Account has been suspended or blocked. Please contact support.';
//       }
//       // Log the attempt for monitoring (optional)
//       console.warn(`⚠️ Login attempt failed for inactive user: ${user.email}, Status: ${user.status}`);
//       // Return 403 Forbidden
//       return res.status(403).json({ message: reason });
//     }
//     // --- End Status Check ---

//     // Compare passwords using bcrypt's async version for slightly better performance (optional)
//     bcrypt.compare(password, user.password, (compareErr, isMatch) => {
//         if (compareErr) {
//             console.error("❌ Error comparing passwords:", compareErr);
//             return res.status(500).json({ message: "Error logging in." });
//         }
//         if (!isMatch) {
//             return res.status(401).json({ message: "Invalid email or password." }); // Keep generic
//         }

//         // --- If login is successful (user is active AND password matches) ---
//         const payload = {
//              id: user.id,
//              role: user.role
//              // Add other non-sensitive claims if needed
//         };
//         const secret = process.env.JWT_SECRET;
//         const options = { expiresIn: "1h" }; // Or use process.env.JWT_EXPIRES_IN

//         if (!secret) {
//              console.error('FATAL ERROR: JWT_SECRET is not defined.');
//              return res.status(500).json({ message: "Server configuration error." });
//         }

//         jwt.sign(payload, secret, options, (err, token) => {
//             if (err) {
//                 console.error('❌ Error signing JWT:', err);
//                 return res.status(500).json({ message: 'Error generating session.' });
//             }

//             // Send back token and essential, non-sensitive user info
//             res.json({
//                 token,
//                 user: {
//                     id: user.id,
//                     email: user.email,
//                     role: user.role,
//                     firstName: user.first_name // Send first name for personalization
//                 }
//              });
//         });
//     }); // End bcrypt.compare
//   }); // End db.query
// }; // End login function


// // =============================================
// // ✅ Email Verification Token Handler (Working)
// // =============================================
// export const verifyEmailToken = (req, res) => {
//   // 1. Get the token from the request body
//   const { token } = req.body;

//   if (!token) {
//     return res.status(400).json({ message: "Verification token is required." });
//   }

//   // 2. Find the user with this token, ensuring it's not expired and user is pending verification
//   const findTokenSql = `
//     SELECT id, status
//     FROM users
//     WHERE email_verification_token = ?
//       AND email_token_expires > NOW()
//       AND status = 'pending_email_verification'
//   `;

//   db.query(findTokenSql, [token], (findErr, results) => {
//     if (findErr) {
//       console.error("❌ Database error finding token:", findErr);
//       return res.status(500).json({ message: "Error verifying email token." });
//     }

//     // 3. Check if a valid token/user combination was found
//     if (results.length === 0) {
//       // Check if token exists but is expired or user status changed
//       const checkExpiredSql = "SELECT id FROM users WHERE email_verification_token = ?";
//       db.query(checkExpiredSql, [token], (expiredErr, expiredResults) => {
//           if(expiredErr) {
//               console.error("❌ DB error checking expired token:", expiredErr);
//               return res.status(500).json({ message: "Error checking token status." }); // Send 500 on DB error
//           }
//           if (expiredResults.length > 0) {
//               // Token exists but doesn't match criteria (expired or status wrong)
//               return res.status(400).json({ message: "Verification link has expired or is invalid. Please request a new one." });
//           } else {
//               // Token doesn't exist at all
//               return res.status(404).json({ message: "Invalid verification token." });
//           }
//       });
//       return; // Stop execution here
//     }

//     // 4. If token is valid, update the user
//     const user = results[0];
//     const userId = user.id;

//     const updateSql = `
//       UPDATE users SET
//         is_email_verified = TRUE,
//         status = 'pending_approval',
//         email_verification_token = NULL,
//         email_token_expires = NULL,
//         updated_at = NOW()
//       WHERE id = ? AND status = 'pending_email_verification'
//     `; // Extra check on status for safety

//     db.query(updateSql, [userId], (updateErr, updateResult) => {
//       if (updateErr) {
//         console.error("❌ Database error updating user status:", updateErr);
//         return res.status(500).json({ message: "Error finalizing email verification." });
//       }

//       if (updateResult.affectedRows === 0) {
//            console.warn(`⚠️ User ${userId} status update affected 0 rows during verification, possible race condition?`);
//            return res.status(400).json({ message: "Could not verify email at this time. Please try again later or contact support." });
//       }

//       console.log(`✅ Email verified for user ID: ${userId}. Status set to pending_approval.`);

//       // 5. Send success response
//       res.json({ message: "Email verified successfully! Your account is now pending administrator approval." });
//     }); // End update query
//   }); // End find token query
// }; // End verifyEmailToken function


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
// ✅ Register User Function (Refactored for Pool)
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
    console.log(`✅ User registered successfully with ID: ${result.insertId}`);

    // 9. Send Verification Email (nodemailer part remains largely the same)
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("⚠️ Email credentials missing. Skipping verification email.");
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
        console.error("❌ Error sending verification email. Details:", mailErr);
        // Still 201 as user was created, but inform about email failure
        return res.status(201).json({
          message: "Registration successful, but the verification email could not be sent. Please contact support.",
          error: "Failed to send verification email."
        });
      }
      console.log("✅ Verification email sent:", info.response);
      res.status(201).json({
        message: "Registration successful! Please check your email inbox (and spam folder) to verify your account."
      });
    });

  } catch (err) { // <-- Catch errors from await blocks
    console.error("❌ Error during registration process:", err);
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
      console.warn(`⚠️ Login attempt failed for inactive user: ${user.email}, Status: ${user.status}`);
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
        console.error('❌ Error signing JWT:', err);
        return res.status(500).json({ message: 'Error generating session.' });
      }
      res.json({
        token,
        user: { id: user.id, email: user.email, role: user.role, firstName: user.first_name }
      });
    });

  } catch (err) { // <-- Catch errors from await blocks
    console.error("❌ Error during login process:", err);
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
      console.warn(`⚠️ User ${userId} status update affected 0 rows during verification...`);
      return res.status(400).json({ message: "Could not verify email at this time." });
    }

    console.log(`✅ Email verified for user ID: ${userId}. Status set to pending_approval.`);
    res.json({ message: "Email verified successfully! Your account is now pending administrator approval." });

  } catch (err) { // <-- Catch errors from await blocks
    console.error("❌ Error during email token verification:", err);
    return res.status(500).json({ message: "Error verifying email token." });
  }
}; // End verifyEmailToken function