// client/src/features/user.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/user";

// Fetch User Profile
export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

// Update User Profile
export const updateUserProfile = async (updatedData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_URL}/profile`, updatedData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, message: response.data.message };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Update failed" };
  }
};
