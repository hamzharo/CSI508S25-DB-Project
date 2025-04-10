import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const sendVerificationEmail = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/send-verification-email`, email );
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || "Something went wrong" };
  }
};

export const verifyEmail = async (token) => {
  try {
    const response = await axios.post(`${API_URL}/verify-email`, { token });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || "Invalid or expired token" };
  }
};

export const registerUser = async (userData) => {
  try {
    console.log("in registerUser");
    console.log(userData);
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || "Registration failed" };
  }
};
