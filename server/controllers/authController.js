// server/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import crypto from 'crypto'; // <-- Make sure crypto is imported

dotenv.config();

// Keep the old sendVerificationEmail and verifyEmail for now,
// they might be useful for a "resend" feature or can be refactored/removed later.
export const sendVerificationEmail = (req, res) => { /* ... existing code ... */ };
export const verifyEmail = (req, res) => { /* ... existing code ... */ };


// =============================================
// ✅ UPDATED Register User Function
// =============================================
export const register = (req, res) => {
  // 1. Destructure all expected fields from req.body
  // Ensure names match the database columns exactly
  const {
    email, password, firstName, lastName, dob, citizenship, ssn, gender,
    phone, address, street, apt, city, country, zip, localAddressSame
  } = req.body;

  // 2. Basic Validation (enhance with library like express-validator later)
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ message: "Missing required fields (Email, Password, First Name, Last Name)." });
  }
  // Add more validation checks here as needed (email format, password strength etc.)

  // 3. Check if email already exists
  const checkEmailSql = "SELECT id FROM users WHERE email = ?";
  db.query(checkEmailSql, [email], (errCheck, resultsCheck) => {
    if (errCheck) {
      console.error("❌ Error checking email:", errCheck);
      return res.status(500).json({ message: "Database error during email check." });
    }
    if (resultsCheck.length > 0) {
      return res.status(409).json({ message: "Email address is already registered." }); // 409 Conflict
    }

    // 4. Hash password asynchronously
    bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
      if (hashErr) {
        console.error("❌ Error hashing password:", hashErr);
        return res.status(500).json({ message: "Error processing registration." });
      }

      // 5. Generate verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');

      // 6. Set token expiry (e.g., 1 hour from now)
      const tokenExpiry = new Date(Date.now() + 3600000); // 1 hour in milliseconds

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
        ssn || null, gender || null, phone || null, address || null,
        street || null, apt || null, city || null, country || null,
        zip || null, localAddressSame === true, // Ensure boolean interpretation
        'customer',                     // Default role
        'pending_email_verification',   // Initial status
        false,                          // is_email_verified
        verificationToken,              // The token
        tokenExpiry                     // The expiry date/time
      ];

      // 8. Execute Insert Query
      db.query(insertSql, values, (insertErr, result) => {
        if (insertErr) {
          console.error("❌ Error inserting user:", insertErr);
          // Provide a more specific error if possible (e.g., duplicate SSN if unique constraint added)
          return res.status(500).json({ message: "Database error during registration." });
        }

        console.log(`✅ User registered successfully with ID: ${result.insertId}`);

        // 9. Send Verification Email
        // Ensure EMAIL_USER and EMAIL_PASS are set in your .env file
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
             console.warn("⚠️ Email credentials not found in .env. Skipping verification email sending.");
             // Still return success as user is in DB, but warn the client/log it.
             return res.status(201).json({
                 message: "Registration successful. Email verification step skipped due to server configuration issue.",
                 warning: "Verification email could not be sent."
             });
        }

        // Construct verification link (use a .env variable for the base URL)
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'; // Default to common React dev port
        const verificationLink = `${frontendUrl}/verify-email?token=${verificationToken}`;

        console.log("📧 Attempting to send verification email to:", email);
        // console.log("🔗 Verification Link:", verificationLink); // Avoid logging sensitive links if possible

        const transporter = nodemailer.createTransport({
          service: "gmail", // Or your configured service e.g. SendGrid, Mailgun
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
          // Optional: Add timeout for debugging
          // connectionTimeout: 5000,
          // greetingTimeout: 5000,
          // socketTimeout: 5000
        });

        const mailOptions = {
          from: `"Online Bank" <${process.env.EMAIL_USER}>`, // Customize sender name
          to: email,
          subject: "Verify Your Email Address for Online Bank",
          text: `Thank you for registering with Online Bank. Please click the following link to verify your email address:\n\n${verificationLink}\n\nIf you did not request this, please ignore this email.\nThis link will expire in 1 hour.`,
          html: `<p>Thank you for registering with Online Bank.</p><p>Please click the link below to verify your email address:</p><p><a href="${verificationLink}">Verify Email Address</a></p><p>If you did not request this, please ignore this email.</p><p>This link will expire in <strong>1 hour</strong>.</p>`, // Optional HTML version
        };

        transporter.sendMail(mailOptions, (mailErr, info) => {
          if (mailErr) {
            console.error("❌ Error sending verification email:", mailErr);
            // Inform user registration succeeded, but email failed.
            // Suggest contacting support or trying a 'resend verification' feature later.
            return res.status(201).json({ // Still 201 because user was created
                 message: "Registration successful, but the verification email could not be sent. Please contact support.",
                 error: "Failed to send verification email.",
                 // Consider logging mailErr details server-side for debugging
            });
          }

          console.log("✅ Verification email sent:", info.response);
          // 10. Return final success response
          res.status(201).json({ // 201 Created is appropriate here
            message: "Registration successful! Please check your email inbox (and spam folder) to verify your account."
          });
        }); // End sendMail
      }); // End db.query INSERT
    }); // End bcrypt.hash
  }); // End db.query checkEmail
}; // End register function

// =============================================
// Keep Existing Login Function (Needs Update Next)
// =============================================
export const login = (req, res) => {
  const { email, password } = req.body;

  // --- THIS NEEDS UPDATING LATER TO CHECK USER STATUS ---
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });

    if (results.length === 0)
      return res.status(401).json({ message: "Invalid email or password" }); // Keep message generic

    const user = results[0];

    // --- Add Status Check Here in the next step ---
    // Example: if (user.status !== 'active') { return res.status(403).json({...}) }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid email or password" }); // Keep message generic
    }

    // --- If login is successful ---
    const token = jwt.sign(
      { id: user.id, role: user.role }, // Payload
      process.env.JWT_SECRET,           // Secret
      { expiresIn: "1h" }               // Options
    );

    // Send back token and essential, non-sensitive user info
    res.json({
        token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.first_name // Send first name for personalization
        }
     });
  });
};