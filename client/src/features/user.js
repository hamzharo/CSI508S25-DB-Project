// client/src/features/user.js - CORRECTED
// import axios from "axios"; // Remove direct axios import
import api from '../utils/api'; // Import your configured instance

// const API_URL = "http://localhost:5000/api/user"; // Remove base URL

// Fetch User Profile
export const getUserProfile = async () => {
  try {
    // Interceptor adds token
    const response = await api.get(`/user/profile`); // Use relative path
    return response.data; // Backend returns structured data with account info
  } catch (error) {
    console.error("Error fetching user profile:", error.response?.data || error.message);
    // Return null or throw error based on handling preference
    return null;
  }
};

// Update User Profile
export const updateUserProfile = async (updatedData) => {
  try {
    // Interceptor adds token
    const response = await api.put(`/user/profile`, updatedData); // Use relative path
    return { success: true, message: response.data.message };
  } catch (error) {
     console.error("Error updating user profile:", error.response?.data || error.message);
    return { success: false, message: error.response?.data?.message || "Update failed" };
  }
};