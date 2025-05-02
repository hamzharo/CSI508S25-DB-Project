// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// --- Layouts ---
import UserLayout from "./layouts/UserLayout"; // Create this file next
import AdminLayout from "./layouts/AdminLayout"; // Create this file next

// --- Components ---
import ProtectedRoute from "./components/ProtectedRoute"; // Import the guard

import ProfilePage from "./pages/ProfilePage";

// --- Public Pages ---
import Home from "./pages/Home";
import VerifyEmail from "./pages/VerifyEmail"; // Ensure correct filename (VerifyEmail.jsx vs VerifyEmailPage.jsx)
import Login from "./pages/Login";
import Register from "./pages/Register";
import Terms from "./pages/Terms";
// import NotFound from "./pages/NotFound"; // Optional: Create a 404 page

// --- Customer Pages ---
import UserDashboard from "./pages/UserDashboard"; // Ensure this file exists
import TransactionHistory from "./pages/Transactions"; // Rename page file if needed
import TransferFunds from "./pages/TransferFunds"; // Ensure this file exists
import UserProfile from "./pages/Settings"; // Rename page file if needed? Or create UserProfile.jsx

// --- Admin Pages ---
import AdminDashboard from "./pages/AdminDashboard"; // Ensure this file exists
// import AdminUserList from "./pages/AdminUserList"; // Example - Create later
// import AdminPendingUsers from "./pages/AdminPendingUsers"; // Example - Create later

// --- Auth Provider ---
// Assuming AuthProvider wraps this in main.jsx
// import AuthProvider from './context/AuthProvider';

function App() {
    // If AuthProvider isn't wrapping in main.jsx, wrap Router with it here:
    // return (
    //   <AuthProvider>
    //     <Router> ... </Router>
    //   </AuthProvider>
    // );

    return (
        // Router should be the top-level component for routing context
      //  <Router>
         //   {/* Consider adding a global Navbar here if needed outside layouts */}
         //   {/* <Navbar /> */}
            <Routes>
                {/* ======================= */}
                {/*    Public Routes        */}
                {/* ======================= */}
                <Route path="/" element={<Home />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/terms" element={<Terms />} />

                {/* ======================= */}
                {/*    Customer Routes      */}
                {/* ======================= */}
                <Route
                    element={
                        <ProtectedRoute requiredRole="customer">
                            <UserLayout /> {/* Wrap customer pages with UserLayout */}
                        </ProtectedRoute>
                    }
                >
                    {/* Pages rendered inside UserLayout's <Outlet /> */}
                    <Route path="/dashboard" element={<UserDashboard />} />
                    <Route path="/transactions" element={<TransactionHistory />} />
                    <Route path="/transfer" element={<TransferFunds />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    {/* <Route path="/profile" element={<UserProfile />} /> */}
                    {/* Add other customer-specific routes here */}
                    {/* Example: <Route path="/accounts/:id" element={<AccountDetails />} /> */}
                </Route>

                {/* ======================= */}
                {/*      Admin Routes       */}
                {/* ======================= */}
                <Route
                    element={
                        <ProtectedRoute requiredRole="admin">
                            <AdminLayout /> {/* Wrap admin pages with AdminLayout */}
                        </ProtectedRoute>
                    }
                >
                    {/* Pages rendered inside AdminLayout's <Outlet /> */}
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    {/* Add other admin-specific routes here */}
                    {/* Example: <Route path="/admin/users" element={<AdminUserList />} /> */}
                    {/* Example: <Route path="/admin/users/pending" element={<AdminPendingUsers />} /> */}
                </Route>

                {/* ======================= */}
                {/*      Not Found Route    */}
                {/* ======================= */}
                {/* Optional: Catch all undefined routes */}
                {/* <Route path="*" element={<NotFound />} /> */}

            </Routes>
          //  {/* Consider adding a global Footer here */}
     //   </Router>
    );
}

export default App;