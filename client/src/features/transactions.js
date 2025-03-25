// client/src/features/transactions.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/transactions";

// Fetch User Transactions
export const getTransactions = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
};

// Transfer Funds
export const transferFunds = async (receiverId, amount) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/transfer`,
      { receiverId, amount },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return { success: true, message: response.data.message };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Transfer failed" };
  }
};
