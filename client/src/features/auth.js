// client/src/features/auth.js
import axios from "axios";
// import { login } from "../features/auth";

// API Base URL
const API_URL = "http://localhost:5000/api/auth";

// User Login Function
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    const { token, role } = response.data;

    // Save user data in local storage
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);

    return { success: true, role };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Login failed" };
  }
};

// User Registration Function
export const register = async (name, email, password) => {
  try {
    await axios.post(`${API_URL}/register`, { name, email, password });
    return { success: true };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Registration failed" };
  }
};

// Logout Function
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};
