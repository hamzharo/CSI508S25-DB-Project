// client/src/features/transactions.js
// import axios from "axios"; 
import api from '../utils/api'; 

// const API_URL = "http://localhost:5000/api/transactions"; 

// Fetch User Transactions
export const getTransactions = async () => {
  try {
    // No token needed here, interceptor adds it
    // Use relative path, baseURL is handled by api instance
    const response = await api.get(`/transactions/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error.response?.data || error.message);
    // Return error or empty array based on how you want to handle it
    throw error.response?.data || new Error("Error fetching transactions"); // Rethrow for caller
  }
};

// Transfer Funds - Make sure param names match backend expectations
export const transferFunds = async (receiverAccountNumber, amount) => { // Check backend controller for expected body keys
  try {
    // Interceptor adds token
    const response = await api.post(
      `/transactions/transfer`,
      { receiverAccountNumber, amount } // Send correct body structure
    );
    return { success: true, message: response.data.message };
  } catch (error) {
    console.error("Error transferring funds:", error.response?.data || error.message);
    return { success: false, message: error.response?.data?.message || "Transfer failed" };
  }
};

 // --- Add Deposit/Withdrawal ---
export const depositFunds = async (accountNumber, amount) => {
    try {
        const response = await api.post('/transactions/deposit', { accountNumber, amount });
        return { success: true, message: response.data.message, newBalance: response.data.newBalance };
    } catch (error) {
        console.error("Error depositing funds:", error.response?.data || error.message);
        return { success: false, message: error.response?.data?.message || "Deposit failed" };
    }
};

export const withdrawFunds = async (accountNumber, amount) => {
    try {
        const response = await api.post('/transactions/withdrawal', { accountNumber, amount });
         return { success: true, message: response.data.message, newBalance: response.data.newBalance };
    } catch (error) {
        console.error("Error withdrawing funds:", error.response?.data || error.message);
        return { success: false, message: error.response?.data?.message || "Withdrawal failed" };
    }
};