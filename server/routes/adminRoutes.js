// server/routes/adminRoutes.js
import express from "express";
import { getAllUsers, updateUserBalance } from "../controllers/adminController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/users", authMiddleware, getAllUsers); // Get All Users (Admin)
router.put("/update-balance", authMiddleware, updateUserBalance); // Update User Balance (Admin)

export default router;
