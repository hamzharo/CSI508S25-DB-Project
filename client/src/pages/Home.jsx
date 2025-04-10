// client/src/pages/Home.jsx
// import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";


export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="p-5 text-center">
        <h1 className="text-3xl font-bold">Welcome to Online Bank Management</h1>
        <p className="mt-2 text-gray-600">Secure, Fast, and Reliable Banking Services</p>
        <div className="mt-4">
          <Link to="/login" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Login
          </Link>
          <Link to="/register" className="ml-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Register
          </Link>
      
        </div>
      </div>
    </div>
  );
}
