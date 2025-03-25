import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

// ✅ User Login
export const login = (req, res) => {
  const { email, password } = req.body;
  console.log("🔹 Login Attempt:", email, password);

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });

    if (results.length === 0) return res.status(401).json({ message: "Invalid email or password" });

    const user = results[0];

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, role: user.role });
  });
};

// ✅ User Registration (Make sure this function is present)
export const register = (req, res) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, email, hashedPassword, role || "user"], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });

    res.json({ message: "User registered successfully" });
  });
};
