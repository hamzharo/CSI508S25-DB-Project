// server/routes/authRoutes.js
import express from "express";
import {
  sendVerificationEmail,
  verifyEmail,
  register,
  login, // ✅ Add login
} from "../controllers/authController.js";

const router = express.Router();

router.post("/send-verification-email", sendVerificationEmail);
router.post("/verify-email", verifyEmail);
router.post("/register", register);
router.post("/login", login); // ✅ This line fixes the error

export default router;
