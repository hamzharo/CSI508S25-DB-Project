// server/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer"; // ✅ Added for email sending

dotenv.config();

// ✅ Send Verification Email
export const sendVerificationEmail = (req, res) => {
  const { email } = req.body;
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "5m" });
  
  const verificationLink = `http://localhost:5174/verify-email?token=${token}`;

  console.log("📧 Sending to:", email);
  console.log("🔗 Link:", verificationLink);

  console.log("Email User:", process.env.EMAIL_USER);
  console.log("Email Pass:", process.env.EMAIL_PASS);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Email",
    text: `Click the link to verify your email: ${verificationLink}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) return res.status(500).json({ message: "Error sending email", error: err });

    res.json({ message: "Verification email sent. Check your inbox!" });
  });
};

// ✅ Verify Email
export const verifyEmail = (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ email: decoded.email, verified: true });
  } catch (err) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};

// ✅ Register User
export const register = (req, res) => {

  console.log("in register");

  const {
    email,
    firstName,
    lastName,
    dob,
    citizenship,
    ssn,
    gender,
    phone,
    address,
    street,
    apt,
    city,
    country,
    zip,
    localAddressSame,
    password
    // termsAccepted
  } = req.body;

  // if (!termsAccepted) return res.status(400).json({ message: "You must accept the terms and conditions" });

  const hashedPassword = bcrypt.hashSync(password, 10);

  const sql = `INSERT INTO users 
    (email, first_name, last_name, dob, citizenship, ssn, gender, phone, address, street, apt, city, country, zip, local_address_same, password) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    sql,
    [
      email,
      firstName,
      lastName,
      dob,
      citizenship,
      ssn,
      gender,
      phone,
      address,
      street,
      apt,
      city,
      country,
      zip,
      localAddressSame,
      hashedPassword,
    ],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });

      res.json({ message: "User registered successfully" });
    }
  );
};

// ✅ Login User (NEW)
export const login = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });

    if (results.length === 0)
      return res.status(401).json({ message: "Invalid email or password" });

    const user = results[0];

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, role: user.role });
  });
};
