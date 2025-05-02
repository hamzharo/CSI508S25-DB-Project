// // src/layouts/UserLayout.jsx
// //import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar'; 
// import {Header} from '../components/layout/Header'; 

const UserLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
        <Header /> {/* Add the Header at the top */}
            <div className="flex flex-1"> {/* This row holds sidebar + main content */}
                <Sidebar />
           
            <Navbar />

            <main className="flex-grow p-4 md:p-6 lg:p-8 bg-gray-100 overflow-y-auto">
            {/* <main className="flex-grow container mx-auto p-4"> */}

            <div className="bg-white p-6 rounded-lg shadow-sm min-h-full"> {/* Added container */}

                {/* Content of nested routes (UserDashboard, etc.) will render here */}
                <Outlet />
                </div>
            </main>
            {/* Optional Footer */}
            {/* <Footer /> */}
        </div>
        </div>
    );
};

export default UserLayout;


