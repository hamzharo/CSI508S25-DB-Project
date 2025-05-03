// // server/routes/adminRoutes.js
// import express from "express";
// import { getAllUsers,
//      updateUserBalance,
//      getPendingUsers, 
//      approveUser,
//      updateUserAdmin } from "../controllers/adminController.js";

// import authMiddleware from "../middleware/authMiddleware.js";
// import adminMiddleware from "../middleware/adminMiddleware.js";

// const router = express.Router();


// router.get(
//     "/users",

//     (req, res, next) => {
//         console.log(`--- Route /api/admin/users (${req.method}) HIT ---`);
//         console.log('Route sees headers:', JSON.stringify(req.headers, null, 2));
//         next(); // Continue to the next middleware (authMiddleware)
//     },
//     // --- End temporary logging middleware ---
//     authMiddleware,  // 1. Check if logged in
//     adminMiddleware, // 2. Check if user is admin
//     getAllUsers      // 3. If both pass, execute controller
// );

// // Get users pending approval
// router.get(
//     "/users/pending",
//     authMiddleware,
//     adminMiddleware,
//     getPendingUsers
// );


// // Approve a specific user
// router.put(
//     "/users/approve/:userId", // Use route parameter for user ID
//     authMiddleware,
//     adminMiddleware,
//     approveUser
// );


// //  Update User Balance (requires admin) - We'll likely replace this later
// router.put(
//     "/update-balance",
//     authMiddleware,
//     adminMiddleware,
//     updateUserBalance
// );

// // --- Admin Route for Updating User ---
// router.put(
//     "/users/:userId", // Matches PUT /api/admin/users/123
//     authMiddleware,
//     adminMiddleware,
//     updateUserAdmin // Handles updating branch, potentially role/status later
// );


// // router.get("/users", authMiddleware, getAllUsers); // Get All Users (Admin)
// // router.put("/update-balance", authMiddleware, updateUserBalance); // Update User Balance (Admin)

// export default router;




// Add this inside your server/routes/adminRoutes.js

import pool from '../config/db.js';
import authMiddleware from '../middleware/authMiddleware.js'; // Assuming these exist
import adminMiddleware from '../middleware/adminMiddleware.js'; // Assuming these exist
import express from 'express';
const router = express.Router(); // Define router if not already defined in the file scope

// --- Endpoint for Dashboard Summary (Corrected for mysql2/promise results) ---
router.get('/summary', authMiddleware, adminMiddleware, async (req, res) => {
    console.log('GET /api/admin/summary hit'); // Add log
    try {
        // Count pending users
        const [pendingUsersRows] = await pool.query("SELECT COUNT(*) as count FROM users WHERE status = 'pending'");
        const pendingApprovals = pendingUsersRows[0]?.count ?? 0; // Use nullish coalescing for safety

        // Count total users
        const [totalUsersRows] = await pool.query("SELECT COUNT(*) as count FROM users");
        const totalUsers = totalUsersRows[0]?.count ?? 0;

        // Count open support tickets
        let openSupportTickets = 0;
        try {
            // Ensure table/column names match your schema
            const [openTicketsRows] = await pool.query("SELECT COUNT(*) as count FROM support_tickets WHERE status = 'open'");
            if (openTicketsRows && openTicketsRows.length > 0) {
                 openSupportTickets = openTicketsRows[0]?.count ?? 0;
             } else {
                  console.warn("No rows returned from support_tickets count query.");
             }
        } catch (ticketError) {
             // Log specific error but don't crash the whole summary if tickets table is missing/problematic
            console.warn("Could not query support_tickets table for summary:", ticketError.message);
            // Optionally set a specific value like 'N/A' or -1 if the query fails
            // openSupportTickets = 'N/A';
        }

        console.log('Summary Counts:', { pendingApprovals, totalUsers, openSupportTickets }); // Log counts
        res.json({
            pendingApprovals,
            totalUsers,
            openSupportTickets,
        });

    } catch (error) {
        console.error('Error fetching admin summary:', error);
        res.status(500).json({ message: 'Server error fetching summary data.' });
    }
});

// --- Make sure to include your other admin routes ---
// e.g., router.get('/users', authMiddleware, adminMiddleware, getAllUsers);
// ... etc ...

export default router; // Ensure the router is exported