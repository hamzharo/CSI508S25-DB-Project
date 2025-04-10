import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./config/db.js";
//import { createUsersTable } from "./models/User.js";
//import { createTransactionsTable } from "./models/Transaction.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
// import branchRoutes from "./routes/branchRoutes.js";
// import supportRoutes from "./routes/supportRoutes.js";
// import fraudRoutes from "./routes/fraudRoutes.js";


dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());


console.log("Connecting to the database...");
// Initialize Tables
//createUsersTable();
//createTransactionsTable();

// ✅ Fix: Add a default route for `/api/`
// app.get("/api", (req, res) => {
//   res.json({ message: "Welcome to the API!" });
// });

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/transactions", transactionRoutes);
// app.use("/api/branches", branchRoutes);
// app.use("/api/support", supportRoutes);
// app.use("/api/fraud", fraudRoutes);
// app.use("/api/accounts", accountRoutes);

app.get("/api", (req, res) =>{
  res.json({message:"Welcome to the Online Bank Management API!"});

});

app.get("/", (req, res) =>  res.send("Server is running ...."));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));


