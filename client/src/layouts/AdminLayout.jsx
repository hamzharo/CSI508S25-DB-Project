// src/layouts/AdminLayout.jsx
//import React from 'react';
import { Outlet } from 'react-router-dom';
// You'll likely want a different Navbar/Sidebar for Admins
// import AdminNavbar from '../components/AdminNavbar'; // Example
import Navbar from '../components/Navbar'; // Using generic one for now

const AdminLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Replace with an Admin-specific navigation component */}
            {/* <AdminNavbar /> */}
            <Navbar />
            <main className="flex-grow container mx-auto p-4">
                {/* Content of nested routes (AdminDashboard, etc.) will render here */}
                <Outlet />
            </main>
            {/* Optional Footer */}
            {/* <Footer /> */}
        </div>
    );
};

export default AdminLayout;