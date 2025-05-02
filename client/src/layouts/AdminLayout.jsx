// // src/layouts/AdminLayout.jsx
// //import React from 'react';
// import { Outlet } from 'react-router-dom';
// // You'll likely want a different Navbar/Sidebar for Admins
// // import AdminNavbar from '../components/AdminNavbar'; // Example
// import Navbar from '../components/Navbar'; // Using generic one for now

// const AdminLayout = () => {
//     return (
//         <div className="flex flex-col min-h-screen">
//             {/* Replace with an Admin-specific navigation component */}
//             {/* <AdminNavbar /> */}
//             <Navbar />
//             <main className="flex-grow container mx-auto p-4">
//                 {/* Content of nested routes (AdminDashboard, etc.) will render here */}
//                 <Outlet />
//             </main>
//             {/* Optional Footer */}
//             {/* <Footer /> */}
//         </div>
//     );
// };

// export default AdminLayout;


// src/layouts/UserLayout.jsx (and AdminLayout.jsx similarly)
import { Outlet } from 'react-router-dom';
// import Sidebar from "./layouts/Sidebar"; // Go up one level from 'layouts' to 'src', then down

const UserLayout = () => {
    return (
        <div className="flex min-h-screen bg-gray-100"> {/* Changed background */}
            <Sidebar /> {/* Add the Sidebar */}
            <main className="flex-grow p-6 md:p-8"> {/* Added padding */}
                {/* Content of nested routes will render here */}
                <Outlet />
            </main>
        </div>
    );
};

export default UserLayout;