// // client/src/pages/AdminDashboard.jsx
// // import React from "react";
// import Navbar from "../components/Navbar";

// export default function AdminDashboard() {
//   return (
//     <div>
//       <Navbar />
//       <div className="p-5">
//         <h2 className="text-2xl font-bold">Admin Dashboard</h2>
//         <p>Manage users and transactions</p>
//       </div>
//     </div>
//   );
// }


// src/pages/AdminDashboard.jsx
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/Button';
import { Users, UserCheck, Building, Ticket, ShieldAlert } from 'lucide-react'; // Example Icons

const AdminDashboard = () => {
    // In a real app, you'd fetch summary data here (e.g., pending users count)
    const pendingUsersCount = 0; // Placeholder
    const totalUsersCount = 0; // Placeholder
    const openTicketsCount = 0; // Placeholder

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Pending Approvals</CardTitle>
                        <UserCheck className="h-5 w-5 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{pendingUsersCount}</div>
                         <Button variant="link" size="sm" className="p-0 h-auto text-xs" asChild>
                            <Link to="/admin/users/pending">View Pending</Link>
                        </Button>
                    </CardContent>
                </Card>
                {/* Add more summary cards: Total Users, Open Tickets, Branches etc. */}
                  <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
                        <Users className="h-5 w-5 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{totalUsersCount}</div>
                        <Button variant="link" size="sm" className="p-0 h-auto text-xs" asChild>
                            <Link to="/admin/users">Manage Users</Link>
                        </Button>
                    </CardContent>
                </Card>
                  <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Open Support Tickets</CardTitle>
                        <Ticket className="h-5 w-5 text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-indigo-600">{openTicketsCount}</div>
                         <Button variant="link" size="sm" className="p-0 h-auto text-xs" asChild>
                            <Link to="/admin/support">View Tickets</Link>
                        </Button>
                    </CardContent>
                </Card>

            </div>

            {/* Quick Action Links/Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>User Management</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Button variant="outline" className="w-full justify-start" asChild><Link to="/admin/users"><Users className="mr-2 h-4 w-4" />View All Users</Link></Button>
                        <Button variant="outline" className="w-full justify-start" asChild><Link to="/admin/users/pending"><UserCheck className="mr-2 h-4 w-4" />Approve Pending Users</Link></Button>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>System Management</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                         <Button variant="outline" className="w-full justify-start" asChild><Link to="/admin/branches"><Building className="mr-2 h-4 w-4" />Manage Branches</Link></Button>
                         <Button variant="outline" className="w-full justify-start" asChild><Link to="/admin/support"><Ticket className="mr-2 h-4 w-4" />Manage Support Tickets</Link></Button>
                         <Button variant="outline" className="w-full justify-start" asChild><Link to="/admin/fraud"><ShieldAlert className="mr-2 h-4 w-4" />Manage Fraud Reports</Link></Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;