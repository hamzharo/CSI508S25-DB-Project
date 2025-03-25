// server/routes/transactionRoutes.js
import express from "express";
import { getTransactions, transferFunds } from "../controllers/transactionController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getTransactions); // Get Transaction History
router.post("/transfer", authMiddleware, transferFunds); // Transfer Funds

export default router;
