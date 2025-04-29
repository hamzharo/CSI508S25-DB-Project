// // client/src/pages/Home.jsx
// // import React from "react";
// import { Link } from "react-router-dom";
// import Navbar from "../components/Navbar";


// export default function Home() {
//   return (
//     <div>
//       <Navbar />
//       <div className="p-5 text-center">
//         <h1 className="text-3xl font-bold">Welcome to Online Bank Management</h1>
//         <p className="mt-2 text-gray-600">Secure, Fast, and Reliable Banking Services</p>
//         <div className="mt-4">
//           <Link to="/login" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
//             Login
//           </Link>
//           <Link to="/register" className="ml-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
//             Register
//           </Link>
      
//         </div>
//       </div>
//     </div>
//   );
// }


// src/pages/Home.jsx - MODIFIED

// import React, { useContext, useEffect } from 'react';
import  { useContext, useEffect } from 'react';

import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
    const { isAuthenticated, user, loading } = useContext(AuthContext);

    // Optional: Show loading state while auth context initializes
    if (loading) {
        return <div>Loading...</div>; // Or a spinner
    }

    // If user is authenticated, redirect them from the home page
    if (isAuthenticated) {
        const targetDashboard = user?.role === 'admin' ? '/admin/dashboard' : '/dashboard';
        console.log(`Home: User is authenticated (Role: ${user?.role}), redirecting to ${targetDashboard}`);
        return <Navigate to={targetDashboard} replace />;
    }

    // If user is not authenticated, show the normal public Home page content
    console.log("Home: User not authenticated, showing public content.");
    return (
        <div>
            <h1>Welcome to the Online Bank!</h1>
            <p>This is the public home page.</p>
            {/* Add links to Login/Register maybe */}
            {/* <Link to="/login">Login</Link> */}
            {/* <Link to="/register">Register</Link> */}
        </div>
    );
};

export default Home;