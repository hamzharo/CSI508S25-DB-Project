// // src/App.jsx
// import { Routes, Route } from "react-router-dom"; // Correct import for Routes and Route

// // --- Layouts ---
// import UserLayout from "./layouts/UserLayout";
// import AdminLayout from "./layouts/AdminLayout";

// // --- Components ---
// import ProtectedRoute from "./components/ProtectedRoute"; // Route guard

// // --- Public Pages ---
// import Home from "./pages/Home";
// import VerifyEmail from "./pages/VerifyEmail";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Terms from "./pages/Terms";
// // import NotFound from "./pages/NotFound"; // Optional: Create and import a 404 page

// // --- Customer Pages ---
// import UserDashboard from "./pages/UserDashboard";
// import TransactionHistory from "./pages/Transactions"; // Ensure this filename matches (or use TransactionsPage)
// import TransferFunds from "./pages/TransferFunds";
// import SupportTickets from "./pages/SupportTickets";   // Added page
// import ReportFraud from "./pages/ReportFraud";       // Added page
// import ProfilePage from "./pages/ProfilePage";         // For /profile route
// import Settings from "./pages/Settings";           // For /settings route (Ensure this page exists)

// // --- Admin Pages ---
// import AdminDashboard from "./pages/AdminDashboard";
// // Import other Admin pages if needed

// function App() {
//     // BrowserRouter is correctly placed in main.jsx, so no need for it here

//     return (
//         <Routes> {/* Routes component wraps all individual Route definitions */}

//             {/* ======================= */}
//             {/*    Public Routes        */}
//             {/* ======================= */}
//             <Route path="/" element={<Home />} />
//             <Route path="/verify-email" element={<VerifyEmail />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/terms" element={<Terms />} />

//             {/* ======================= */}
//             {/*    Customer Routes      */}
//             {/* ======================= */}
//             {/* Parent Route for Customer pages, applying protection and layout */}
//             <Route
//                 element={
//                     <ProtectedRoute requiredRole="customer">
//                         <UserLayout /> {/* UserLayout contains Sidebar, Header, and Outlet */}
//                     </ProtectedRoute>
//                 }
//             >
//                 {/* Child Routes rendered inside UserLayout's <Outlet /> */}
//                 <Route path="/dashboard" element={<UserDashboard />} />
//                 <Route path="/transactions" element={<TransactionHistory />} />
//                 <Route path="/transfer" element={<TransferFunds />} />
//                 <Route path="/support" element={<SupportTickets />} />
//                 <Route path="/report-fraud" element={<ReportFraud />} />
//                 <Route path="/profile" element={<ProfilePage />} />
//                 <Route path="/settings" element={<Settings />} /> {/* Make sure Settings page component exists */}
//                 {/* Add other customer-specific routes here if needed */}
//                 {/* Example: <Route path="/accounts" element={<AccountsPage />} /> */}
//             </Route>

//             {/* ======================= */}
//             {/*      Admin Routes       */}
//             {/* ======================= */}
//             {/* Parent Route for Admin pages, applying protection and layout */}
//             <Route
//                 element={
//                     <ProtectedRoute requiredRole="admin">
//                         <AdminLayout /> {/* AdminLayout contains its own Sidebar/Nav and Outlet */}
//                     </ProtectedRoute>
//                 }
//             >
//                 {/* Child Routes rendered inside AdminLayout's <Outlet /> */}
//                 <Route path="/admin/dashboard" element={<AdminDashboard />} />
//                 {/* Add other admin-specific routes here */}
//                 {/* Example: <Route path="/admin/users" element={<AdminUserList />} /> */}
//             </Route>

//             {/* ======================= */}
//             {/*      Not Found Route    */}
//             {/* ======================= */}
//             {/* Optional: Catch all undefined routes */}
//             {/* <Route path="*" element={<NotFound />} /> */}

//         </Routes>
//     );
// }

// export default App;



// src/App.jsx
import AuthProvider from "./context/AuthContext";
import { Routes, Route } from "react-router-dom";

// --- Layouts ---
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

// --- Components ---
import ProtectedRoute from "./components/ProtectedRoute";

// --- Public Pages ---
import Home from "./pages/Home";
import VerifyEmail from "./pages/VerifyEmail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Terms from "./pages/Terms";

// --- Customer Pages ---
import UserDashboard from "./pages/UserDashboard";
import TransactionHistory from "./pages/Transactions";
import TransferFunds from "./pages/TransferFunds";
import SupportTickets from "./pages/SupportTickets";
import ReportFraud from "./pages/ReportFraud";
import ProfilePage from "./pages/ProfilePage";
import Settings from "./pages/Settings";

// --- Admin Pages ---
import AdminDashboard from "./pages/AdminDashboard"; // Should be here
// Correct paths assuming files are in src/pages/admin/
import AdminUserList from "./pages/admin/AdminUserList";
import AdminPendingUserList from "./pages/admin/AdminPendingUserList";
import AdminSupportTicketList from "./pages/admin/AdminSupportTicketList"; // Placeholder component
import AdminBranchManagement from "./pages/admin/AdminBranchManagement";   // Placeholder component
import AdminFraudReportList from "./pages/admin/AdminFraudReportList"; // Placeholder component

// import NotFound from "./pages/NotFound"; // Optional

function App() {
    return (
        <AuthProvider>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/terms" element={<Terms />} />

                {/* Customer Routes */}
                <Route element={<ProtectedRoute requiredRole="customer"><UserLayout /></ProtectedRoute>}>
                    <Route path="/dashboard" element={<UserDashboard />} />
                    <Route path="/transactions" element={<TransactionHistory />} />
                    <Route path="/transfer" element={<TransferFunds />} />
                    <Route path="/support" element={<SupportTickets />} />
                    <Route path="/report-fraud" element={<ReportFraud />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/settings" element={<Settings />} />
                </Route>

                {/* Admin Routes */}
                <Route element={<ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>} >
                    {/* Ensure AdminDashboard is directly inside the protected route if it's the main landing page */}
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    {/* Specific Admin Management Pages */}
                    <Route path="/admin/users" element={<AdminUserList />} />
                    <Route path="/admin/users/pending" element={<AdminPendingUserList />} />
                    <Route path="/admin/support" element={<AdminSupportTicketList />} />
                    <Route path="/admin/branches" element={<AdminBranchManagement />} />
                    <Route path="/admin/fraud" element={<AdminFraudReportList />} />
                    {/* Add routes for specific edit/view pages if needed, e.g., /admin/users/edit/:userId */}
                </Route>

                {/* Optional: Not Found Route */}
                {/* <Route path="*" element={<NotFound />} /> */}
            </Routes>
        </AuthProvider>
    );
}

export default App;