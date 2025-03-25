import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./config/db.js";
import { createUsersTable } from "./models/User.js";
import { createTransactionsTable } from "./models/Transaction.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Initialize Tables
createUsersTable();
createTransactionsTable();

// ✅ Fix: Add a default route for `/api/`
app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the API!" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/transactions", transactionRoutes);

app.get("/", (req, res) => res.send("Server is running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
