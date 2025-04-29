// src/features/authService.js
import api from '../utils/api'; // Import the configured Axios instance

// Note: The register and verify functions might be called directly from AuthContext now,
// but keeping them here as separate service functions is also a valid pattern.

// Original sendVerificationEmail might be useful for a "resend" feature
// export const sendVerificationEmail = async (email) => {
//   try {
//     // Adjust URL to be relative to baseURL in api.js
//     const response = await api.post(`/auth/send-verification-email`, { email }); // Pass email correctly as object
//     return response.data;
//   } catch (error) {
//     console.error("AuthService: Sending verification email failed", error);
//     return { error: error.response?.data?.message || "Something went wrong" };
//   }
// };

// This function now likely lives primarily within the AuthContext verifyUserEmail function
// export const verifyEmail = async (token) => {
//   try {
//     // Adjust URL
//     const response = await api.post(`/auth/verify-token`, { token });
//     return response.data;
//   } catch (error) {
//     console.error("AuthService: Verifying email failed", error);
//     return { error: error.response?.data?.message || "Invalid or expired token" };
//   }
// };


// Example of keeping registerUser here, though AuthContext also has a register function now.
// Choose one place to keep the primary logic. If keeping here:
export const registerUser = async (userData) => {
  try {
    console.log("AuthService: Registering user...");
    // Adjust URL to be relative to baseURL
    const response = await api.post('/auth/register', userData);
    return response.data; // Return backend response directly
  } catch (error) {
     console.error("AuthService: Registration failed", error);
    // Re-throw the error or return a structured error object
    throw error.response?.data || { message: "Registration failed" };
  }
};

// Example Login service function (also duplicated in AuthContext)
export const loginUser = async (email, password) => {
  try {
    console.log("AuthService: Logging in user...");
     // Adjust URL
    const response = await api.post('/auth/login', { email, password });
    return response.data; // Returns { token, user }
  } catch (error) {
     console.error("AuthService: Login failed", error);
     throw error.response?.data || { message: "Login failed" };
  }
};


// You would add other auth-related service calls here if needed,
// like forgotPassword, resetPassword, etc.

export const forgotPasswordRequest = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data; // Returns { message: "..." }
  } catch (error) {
     console.error("AuthService: Forgot password request failed", error);
     throw error.response?.data || { message: "Forgot password request failed" };
  }
};

export const resetPasswordSubmit = async (token, newPassword) => {
   try {
    const response = await api.post('/auth/reset-password', { token, newPassword });
    return response.data; // Returns { message: "..." }
  } catch (error) {
     console.error("AuthService: Password reset failed", error);
     throw error.response?.data || { message: "Password reset failed" };
  }
};