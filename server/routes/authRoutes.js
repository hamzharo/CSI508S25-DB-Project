// server/routes/authRoutes.js
import express from "express";
import {
  // sendVerificationEmail, // Keep if you want a resend feature later
  // verifyEmail, // This is the old one - remove/comment out
  register,
  login,
  verifyEmailToken, // <-- IMPORT the new function
} from "../controllers/authController.js";

const router = express.Router();

// Optional: Keep for resend feature if needed
// router.post("/send-verification-email", sendVerificationEmail);

// Comment out or remove the old verification route
// router.post("/verify-email", verifyEmail);

// Core auth routes
router.post("/register", register);
router.post("/login", login);

//  NEW Route for handling token verification from email link
router.post("/verify-token", verifyEmailToken); // <-- ADD this line

export default router;