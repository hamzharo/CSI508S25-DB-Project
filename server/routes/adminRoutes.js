// server/routes/adminRoutes.js
import express from "express";
import { getAllUsers,
     updateUserBalance,
     getPendingUsers, 
     approveUser  } from "../controllers/adminController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();


router.get(
    "/users",

    (req, res, next) => {
        console.log(`--- Route /api/admin/users (${req.method}) HIT ---`);
        console.log('Route sees headers:', JSON.stringify(req.headers, null, 2));
        next(); // Continue to the next middleware (authMiddleware)
    },
    // --- End temporary logging middleware ---
    authMiddleware,  // 1. Check if logged in
    adminMiddleware, // 2. Check if user is admin
    getAllUsers      // 3. If both pass, execute controller
);

// Get users pending approval
router.get(
    "/users/pending",
    authMiddleware,
    adminMiddleware,
    getPendingUsers
);


// Approve a specific user
router.put(
    "/users/approve/:userId", // Use route parameter for user ID
    authMiddleware,
    adminMiddleware,
    approveUser
);


//  Update User Balance (requires admin) - We'll likely replace this later
router.put(
    "/update-balance",
    authMiddleware,
    adminMiddleware,
    updateUserBalance
);


// router.get("/users", authMiddleware, getAllUsers); // Get All Users (Admin)
// router.put("/update-balance", authMiddleware, updateUserBalance); // Update User Balance (Admin)

export default router;
