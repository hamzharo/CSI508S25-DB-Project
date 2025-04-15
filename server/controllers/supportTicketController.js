// server/controllers/supportTicketController.js
import pool from "../config/db.js";

/**
 * @desc    Create a new support ticket
 * @route   POST /api/support/tickets
 * @access  Private (Customer Only)
 */
export const createSupportTicket = async (req, res) => {
    const customerId = req.user.id; // From authMiddleware
    const { subject, description, priority, related_account_id, related_transaction_id } = req.body;

    // Validation
    if (!subject || !description) {
        return res.status(400).json({ message: "Subject and description are required." });
    }
    // Optional: Validate priority enum, related IDs if needed

    try {
        const sql = `
            INSERT INTO support_tickets
                (customer_id, subject, description, priority, related_account_id, related_transaction_id, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await pool.query(sql, [
            customerId,
            subject,
            description,
            priority || 'medium', // Default priority if not provided
            related_account_id || null,
            related_transaction_id || null,
            'open' // Initial status
        ]);

        const newTicketId = result.insertId;
        console.log(`✅ Support ticket created by User ${customerId} with ID: ${newTicketId}`);

        // Fetch the created ticket to return it
        const [newTicket] = await pool.query("SELECT * FROM support_tickets WHERE id = ?", [newTicketId]);
        res.status(201).json(newTicket[0]);

    } catch (err) {
        console.error("❌ Database error creating support ticket:", err);
         if (err.code === 'ER_NO_REFERENCED_ROW_2') {
             // Handle cases where related_account_id or related_transaction_id is invalid
             return res.status(400).json({ message: "Invalid related account or transaction ID provided." });
        }
        res.status(500).json({ message: "Error creating support ticket.", error: err.message });
    }
};

/**
 * @desc    Get support tickets for the logged-in customer
 * @route   GET /api/support/tickets/my-tickets
 * @access  Private (Customer Only)
 */
export const getMySupportTickets = async (req, res) => {
    const customerId = req.user.id;

    try {
        const sql = `
            SELECT st.*, CONCAT(u.first_name, ' ', u.last_name) as assigned_admin_name
            FROM support_tickets st
            LEFT JOIN users u ON st.assigned_admin_id = u.id
            WHERE st.customer_id = ?
            ORDER BY st.updated_at DESC, st.created_at DESC
        `;
        const [tickets] = await pool.query(sql, [customerId]);
        res.json(tickets);
    } catch (err) {
        console.error("❌ Database error getting customer support tickets:", err);
        res.status(500).json({ message: "Error fetching support tickets." });
    }
};


// --- Admin Functions ---

/**
 * @desc    Get all support tickets (for Admin view)
 * @route   GET /api/admin/support/tickets
 * @access  Private (Admin Only)
 */
export const getAllSupportTicketsAdmin = async (req, res) => {
    // Add filtering/pagination later (e.g., by status, assigned admin)
    try {
        const sql = `
            SELECT
                st.*,
                CONCAT(cust.first_name, ' ', cust.last_name) as customer_name, cust.email as customer_email,
                CONCAT(adm.first_name, ' ', adm.last_name) as assigned_admin_name
            FROM support_tickets st
            JOIN users cust ON st.customer_id = cust.id
            LEFT JOIN users adm ON st.assigned_admin_id = adm.id
            ORDER BY
                CASE st.status
                    WHEN 'open' THEN 1
                    WHEN 'in_progress' THEN 2
                    WHEN 'reopened' THEN 3
                    WHEN 'resolved' THEN 4
                    WHEN 'closed' THEN 5
                    ELSE 6
                END,
                st.updated_at DESC, st.created_at DESC
        `;
        const [tickets] = await pool.query(sql);
        res.json(tickets);
    } catch (err) {
        console.error("❌ Database error getting all support tickets (admin):", err);
        res.status(500).json({ message: "Error fetching support tickets." });
    }
};

/**
 * @desc    Get a single support ticket by ID (for Admin view)
 * @route   GET /api/admin/support/tickets/:id
 * @access  Private (Admin Only)
 */
export const getSupportTicketByIdAdmin = async (req, res) => {
    const { id } = req.params;
    const ticketId = parseInt(id);

    if (isNaN(ticketId)) {
        return res.status(400).json({ message: "Invalid ticket ID." });
    }

    try {
         const sql = `
            SELECT
                st.*,
                CONCAT(cust.first_name, ' ', cust.last_name) as customer_name, cust.email as customer_email,
                CONCAT(adm.first_name, ' ', adm.last_name) as assigned_admin_name
            FROM support_tickets st
            JOIN users cust ON st.customer_id = cust.id
            LEFT JOIN users adm ON st.assigned_admin_id = adm.id
            WHERE st.id = ?
        `;
        const [tickets] = await pool.query(sql, [ticketId]);

        if (tickets.length === 0) {
            return res.status(404).json({ message: "Support ticket not found." });
        }
        res.json(tickets[0]);
    } catch (err) {
        console.error(`❌ Database error getting support ticket ${ticketId} (admin):`, err);
        res.status(500).json({ message: "Error fetching support ticket details." });
    }
};


/**
 * @desc    Update a support ticket (status, priority, assignment - Admin)
 * @route   PUT /api/admin/support/tickets/:id
 * @access  Private (Admin Only)
 */
export const updateSupportTicketAdmin = async (req, res) => {
    const { id } = req.params;
    const ticketId = parseInt(id);
    // Admin performing the update
    const adminUserId = req.user.id;
    // Fields allowed to be updated by admin
    const { status, priority, assigned_admin_id } = req.body;

    if (isNaN(ticketId)) {
        return res.status(400).json({ message: "Invalid ticket ID." });
    }

    // Validate input values if necessary (e.g., check if status/priority are valid enum values)
    // ... validation logic ...

    // Build SET clause dynamically
    const fieldsToUpdate = {};
    if (status) fieldsToUpdate.status = status;
    if (priority) fieldsToUpdate.priority = priority;
    // Allow assigning to null or a specific admin ID
    if (assigned_admin_id !== undefined) fieldsToUpdate.assigned_admin_id = assigned_admin_id === null ? null : parseInt(assigned_admin_id);

    // Update timestamps based on status change
    if (status === 'resolved') fieldsToUpdate.resolved_at = new Date();
    if (status === 'closed') fieldsToUpdate.closed_at = new Date();

    if (Object.keys(fieldsToUpdate).length === 0) {
        return res.status(400).json({ message: "No update information provided (status, priority, assigned_admin_id)." });
    }

    // Add updated_at timestamp
    fieldsToUpdate.updated_at = new Date();

    // Optional: Pre-check if assigned_admin_id is valid admin
    if (fieldsToUpdate.assigned_admin_id !== null && fieldsToUpdate.assigned_admin_id !== undefined) {
         if (isNaN(fieldsToUpdate.assigned_admin_id)) {
             return res.status(400).json({ message: "Invalid assigned admin ID provided." });
         }
         // Add check here to ensure the ID belongs to an actual admin user
    }


    try {
        const sql = "UPDATE support_tickets SET ? WHERE id = ?";
        const [result] = await pool.query(sql, [fieldsToUpdate, ticketId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Support ticket not found or no changes made." });
        }

        console.log(`✅ Support ticket ${ticketId} updated by Admin ${adminUserId}`);
        // Fetch updated ticket data to return
        const [updatedTicket] = await pool.query("SELECT * FROM support_tickets WHERE id = ?", [ticketId]);
        res.json(updatedTicket[0]);

    } catch (err) {
        console.error(`❌ Database error updating support ticket ${ticketId} (admin):`, err);
         if (err.code === 'ER_NO_REFERENCED_ROW_2') {
             return res.status(400).json({ message: "Update failed. Invalid assigned admin ID provided." });
        }
        res.status(500).json({ message: "Error updating support ticket.", error: err.message });
    }
};