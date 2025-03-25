// client/src/context/AuthContext.jsx
// import React, { createContext, useState, useEffect } from "react";
import { createContext, useState, useEffect } from "react";
import axios from "axios";

// Create authentication context
export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to log in the user
  const login = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      const { token, role } = response.data;

      // Save token to local storage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      setUser({ email, role });
      return { success: true };
    } catch (error) {
      console.error("Login failed", error);
      return { success: false, message: error.response?.data?.message || "Login error" };
    }
  };

  // Function to register a new user
  const register = async (name, email, password) => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", { name, email, password });
      return { success: true };
    } catch (error) {
      console.error("Registration failed", error);
      return { success: false, message: error.response?.data?.message || "Registration error" };
    }
  };

  // Function to log out the user
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
  };

  // Check if user is authenticated when app loads
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token) {
      setUser({ email: "User", role });
    }

    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
