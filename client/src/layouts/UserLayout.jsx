// src/layouts/UserLayout.jsx
//import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Assuming Navbar is suitable or adapt it

const UserLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* You might want a customer-specific Navbar here */}
            <Navbar />
            <main className="flex-grow container mx-auto p-4">
                {/* Content of nested routes (UserDashboard, etc.) will render here */}
                <Outlet />
            </main>
            {/* Optional Footer */}
            {/* <Footer /> */}
        </div>
    );
};

export default UserLayout;