import express from "express";
import { login, register } from "../controllers/authController.js"; // ✅ Fix: Ensure 'register' is exported

const router = express.Router();

router.post("/login", login);
router.post("/register", register);

export default router;
