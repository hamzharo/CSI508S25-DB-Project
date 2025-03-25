// client/src/pages/AdminDashboard.jsx
// import React from "react";
import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  return (
    <div>
      <Navbar />
      <div className="p-5">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <p>Manage users and transactions</p>
      </div>
    </div>
  );
}
