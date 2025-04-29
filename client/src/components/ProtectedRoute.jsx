// src/components/ProtectedRoute.jsx

//import React, { useContext } from 'react';
import  { useContext } from 'react';

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Make sure this path is correct

/**
 * A component to protect routes based on authentication status and optionally user role.
 * @param {object} props
 * @param {string} [props.requiredRole] - The role required to access the route (e.g., 'admin', 'customer'). If omitted, only authentication is checked.
 */
const ProtectedRoute = ({ requiredRole }) => {
    const { isAuthenticated, user, isLoading } = useContext(AuthContext);
    const location = useLocation(); // Get current location to redirect back after login

    // 1. Handle Loading State from AuthContext
    // It's important AuthContext provides an 'isLoading' state, especially
    // when initially checking for a token (e.g., from localStorage) on app load.
    if (isLoading) {
        // You can replace this with a nicer loading spinner component
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div>Loading Authentication...</div>
            </div>
        );
    }

    // 2. Check if Authenticated
    if (!isAuthenticated) {
        // User is not logged in. Redirect them to the login page.
        // We save the current location in 'state.from' so we can redirect
        // back here after they successfully log in (LoginPage needs to handle this).
        console.log('[ProtectedRoute] User not authenticated. Redirecting to /login.');
        return <Navigate to="/login" state={{ from: location }} replace />;
        // 'replace' prevents the login page from being added to history stack.
    }

    // 3. Check Role (if a specific role is required for this route)
    if (requiredRole && user?.role !== requiredRole) {
        // User is logged in, but their role doesn't match the required role.
        console.log(`[ProtectedRoute] Role mismatch. User Role: '${user?.role}', Required Role: '${requiredRole}'. Redirecting.`);
        // Redirect them to their default dashboard or a generic 'unauthorized' page.
        // Redirecting based on their actual role is often better UX.
        const defaultDashboard = user?.role === 'admin' ? '/admin/dashboard' : '/dashboard';
        return <Navigate to={defaultDashboard} replace />;
        // Alternatively, you could create and redirect to a dedicated /unauthorized page:
        // return <Navigate to="/unauthorized" replace />;
    }

    // 4. Access Granted: User is authenticated and has the correct role (or no role was required)
    // Render the child components defined within this route in App.jsx
    console.log(`[ProtectedRoute] Access granted for role: ${user?.role} (Required: ${requiredRole || 'any'}). Rendering Outlet.`);
    return <Outlet />;
};

export default ProtectedRoute;