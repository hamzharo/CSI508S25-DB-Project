// // client/src/features/transactions.js
// // import axios from "axios"; 
// import api from '../utils/api'; 

// // const API_URL = "http://localhost:5000/api/transactions"; 

// // Fetch User Transactions
// export const getTransactions = async () => {
//   try {
//     // No token needed here, interceptor adds it
//     // Use relative path, baseURL is handled by api instance
//     const response = await api.get(`/transactions/`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching transactions:", error.response?.data || error.message);
//     // Return error or empty array based on how you want to handle it
//     throw error.response?.data || new Error("Error fetching transactions"); // Rethrow for caller
//   }
// };

// // Transfer Funds - Make sure param names match backend expectations
// export const transferFunds = async (receiverAccountNumber, amount) => { // Check backend controller for expected body keys
//   try {
//     // Interceptor adds token
//     const response = await api.post(
//       `/transactions/transfer`,
//       { receiverAccountNumber, amount } // Send correct body structure
//     );
//     return { success: true, message: response.data.message };
//   } catch (error) {
//     console.error("Error transferring funds:", error.response?.data || error.message);
//     return { success: false, message: error.response?.data?.message || "Transfer failed" };
//   }
// };

//  // --- Add Deposit/Withdrawal ---
// export const depositFunds = async (accountNumber, amount) => {
//     try {
//         const response = await api.post('/transactions/deposit', { accountNumber, amount });
//         return { success: true, message: response.data.message, newBalance: response.data.newBalance };
//     } catch (error) {
//         console.error("Error depositing funds:", error.response?.data || error.message);
//         return { success: false, message: error.response?.data?.message || "Deposit failed" };
//     }
// };

// export const withdrawFunds = async (accountNumber, amount) => {
//     try {
//         const response = await api.post('/transactions/withdrawal', { accountNumber, amount });
//          return { success: true, message: response.data.message, newBalance: response.data.newBalance };
//     } catch (error) {
//         console.error("Error withdrawing funds:", error.response?.data || error.message);
//         return { success: false, message: error.response?.data?.message || "Withdrawal failed" };
//     }
// };



// src/features/transactions.js
import api from '@/utils/api';
import { toast } from 'react-hot-toast';

/**
 * Fetches transactions, potentially filtered.
 * @param {object} [filters] - Optional filters like { accountId, type, dateRange }
 * @returns {Promise<Array<object>>} List of transactions.
 */
export const getTransactions = async (filters = {}) => {
    try {
        console.log("API Call: Fetching transactions with filters:", filters);
        const response = await api.get('/transactions', { params: filters }); // Assuming GET /api/transactions endpoint
        console.log("API Response: Transactions fetched.", response.data);
        return Array.isArray(response?.data) ? response.data : [];
    } catch (error) {
        console.error("API Error: Failed to fetch transactions:", error.response?.data || error.message);
        const message = error.response?.data?.message || 'Failed to load transactions.';
        toast.error(message);
        return []; // Return empty array on error
    }
};


// --- UPDATED DEPOSIT FUNCTION ---
/**
 * Creates a simulated deposit transaction by sending Account Number.
 * @param {string} accountNumber - The ACCOUNT NUMBER to deposit into. <-- CHANGED
 * @param {number} amount - The amount to deposit.
 * @param {string} [description] - Optional description.
 * @returns {Promise<object>} The created transaction data or success message.
 */
export const makeDeposit = async (accountNumber, amount, description = 'Customer deposit') => { // <-- CHANGED first parameter name
    try {
        console.log(`API Call: Making deposit - Account#: ${accountNumber}, Amount: ${amount}`); // <-- Updated log
        // Backend route: POST /api/transactions/deposit
        // Send accountNumber as expected by the backend controller
        const response = await api.post('/transactions/deposit', {
            accountNumber, // <-- SEND accountNumber
            amount,
            description
        });
        console.log("API Response: Deposit successful.", response.data);
        toast.success(response.data?.message || 'Deposit successful!');
        return response.data;
    } catch (error) {
        console.error("API Error: Failed to make deposit:", error.response?.data || error.message);
        const message = error.response?.data?.message || 'Deposit failed.';
        toast.error(message);
        throw new Error(message); // Re-throw error for component handling
    }
};

// --- ADD THIS TRANSFER FUNCTION ---
/**
 * Initiates a fund transfer between accounts.
 * @param {string} receiverAccountNumber - The account number to transfer funds to.
 * @param {number} amount - The amount to transfer.
 * @returns {Promise<object>} Success message or response data.
 */
export const transferFunds = async (receiverAccountNumber, amount) => {
  try {
      console.log(`API Call: Transferring funds - To Account#: ${receiverAccountNumber}, Amount: ${amount}`);
      // Backend route: POST /api/transactions/transfer
      // Backend controller expects { receiverAccountNumber, amount }
      const response = await api.post('/transactions/transfer', {
          receiverAccountNumber,
          amount
      });
      console.log("API Response: Transfer successful.", response.data);
      toast.success(response.data?.message || 'Transfer successful!');
      return response.data; // Return response data
  } catch (error) {
      console.error("API Error: Failed to transfer funds:", error.response?.data || error.message);
      const message = error.response?.data?.message || 'Transfer failed.';
      toast.error(message);
      throw new Error(message); // Re-throw error for component handling
  }
};
// --- END ADDED FUNCTION ---