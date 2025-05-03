// // src/pages/admin/AdminPendingUserList.jsx
// import { useState, useEffect, useCallback } from 'react';
// import { Link } from 'react-router-dom';
// import api from '../../utils/api'; // Adjust path if needed
// // import { Button } from '@/components/ui/Button';
// import Button from '@/components/ui/Button'; // Note the curly braces {} and capital B // Assuming ShadCN UI Button
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // Assuming ShadCN Table
// import { Loader2, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react'; // Icons
// import { toast } from 'react-hot-toast'; // Or your preferred notification library

// const AdminPendingUserList = () => {
//     const [pendingUsers, setPendingUsers] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [approvingId, setApprovingId] = useState(null); // Track which user is being approved

//     const fetchPendingUsers = useCallback(async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await api.get('/admin/users/pending');
//             setPendingUsers(response.data);
//         } catch (err) {
//             console.error("Error fetching pending users:", err);
//             const errorMessage = err.response?.data?.message || "Failed to load pending users.";
//             setError(errorMessage);
//             setPendingUsers([]);
//             toast.error(errorMessage);
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     useEffect(() => {
//         fetchPendingUsers();
//     }, [fetchPendingUsers]);

//     const handleApprove = async (userId) => {
//         if (approvingId) return; // Prevent multiple clicks

//         setApprovingId(userId);
//         try {
//             // Uses PUT /api/admin/users/approve/:userId
//             await api.put(`/admin/users/approve/${userId}`);
//             toast.success(`User ${userId} approved successfully!`);

//             // Optimistically remove from UI
//             setPendingUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
//             // Alternatively, refetch: fetchPendingUsers();

//         } catch (err) {
//             console.error("Error approving user:", err);
//             toast.error(err.response?.data?.message || `Failed to approve user ${userId}.`);
//              // If optimistic update failed, consider refetching to revert UI
//              // fetchPendingUsers();
//         } finally {
//             setApprovingId(null);
//         }
//     };

//     // --- Render Logic ---
//     let content;
//     if (loading) {
//         content = (
//             <div className="flex justify-center items-center p-10">
//                 <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
//                 <span className="ml-3 text-gray-600">Loading Pending Users...</span>
//             </div>
//         );
//     } else if (error) {
//         content = (
//             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4 flex items-center" role="alert">
//                 <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
//                 <span className="block sm:inline">{error}</span>
//              </div>
//         );
//     } else if (pendingUsers.length === 0) {
//         content = <p className="text-center text-gray-500 py-6">No users are currently pending approval.</p>;
//     } else {
//         content = (
//             <Table>
//                 <TableHeader>
//                     <TableRow>
//                         <TableHead className="w-[100px]">ID</TableHead>
//                         <TableHead>Name</TableHead>
//                         <TableHead>Email</TableHead>
//                         <TableHead>Registered On</TableHead>
//                         <TableHead className="text-right">Actions</TableHead>
//                     </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                     {pendingUsers.map(user => (
//                         <TableRow key={user.id}>
//                             <TableCell className="font-medium">{user.id}</TableCell>
//                             <TableCell>{user.first_name} {user.last_name}</TableCell>
//                             <TableCell>{user.email}</TableCell>
//                              <TableCell>
//                                 {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
//                             </TableCell>
//                             <TableCell className="text-right">
//                                 <Button
//                                     variant="default" // Use default primary style
//                                     size="sm"
//                                     onClick={() => handleApprove(user.id)}
//                                     disabled={approvingId === user.id}
//                                     className="bg-green-600 hover:bg-green-700 text-white px-3 py-1"
//                                 >
//                                     {approvingId === user.id ? (
//                                         <Loader2 className="mr-1 h-4 w-4 animate-spin" />
//                                     ) : (
//                                         <CheckCircle className="mr-1 h-4 w-4" />
//                                     )}
//                                     Approve
//                                 </Button>
//                                 {/* Consider adding a Reject button here */}
//                                 {/* <Button variant="destructive" size="sm" className="ml-2">Reject</Button> */}
//                             </TableCell>
//                         </TableRow>
//                     ))}
//                 </TableBody>
//             </Table>
//         );
//     }
//     // --- End Render Logic ---

//     return (
//         <div className="space-y-4">
//             <div className="flex justify-between items-center mb-4">
//                 <h1 className="text-2xl font-bold text-gray-800">Pending User Approvals</h1>
//                  <Button variant="outline" size="sm" asChild>
//                      <Link to="/admin/dashboard" className='flex items-center'>
//                         <ArrowLeft className="mr-1 h-4 w-4" /> Back to Dashboard
//                      </Link>
//                  </Button>
//             </div>
//              <div className="bg-white shadow-md rounded-lg overflow-hidden"> {/* Container card */}
//                  <div className="p-4 md:p-0">{content}</div> {/* Add padding only if table not full width */}
//              </div>
//         </div>
//     );
// };

// export default AdminPendingUserList;


// src/pages/admin/AdminPendingUserList.jsx
import { useState, useEffect } from 'react';
import { adminGetPendingUsers, adminApproveUser } from '@/features/admin'; // API functions

// Shadcn UI imports
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import  Button  from "@/components/ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Terminal, CheckCircle, UserCheck } from 'lucide-react';
import { Badge } from "@/components/ui/badge"; // For status/verified badges

// Helper to format date
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
    } catch { return dateString; }
};

export default function AdminPendingUserList() {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [approvingUserId, setApprovingUserId] = useState(null); // Track which user is being approved

    // Fetch pending users function
    const fetchPending = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await adminGetPendingUsers();
            setPendingUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch on mount
    useEffect(() => {
        fetchPending();
    }, []);

    // Handle user approval
    const handleApprove = async (userId) => {
        setApprovingUserId(userId); // Set loading state for this specific user
        setError(null); // Clear previous errors
        try {
            await adminApproveUser(userId);
            // Refresh the list after successful approval
            fetchPending(); // Re-fetches the list, approved user will be gone
        } catch (err) {
            setError(`Failed to approve user ${userId}: ${err.message}`);
            // Error toast is handled in the API function, but set local error too
        } finally {
            setApprovingUserId(null); // Clear loading state for this user
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <UserCheck className="w-6 h-6" />
                    Pending User Approvals
                </CardTitle>
                <CardDescription>Review and approve newly registered users.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading && (
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                )}
                {error && !isLoading && (
                    <Alert variant="destructive">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Error Loading Pending Users</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                {!isLoading && !error && pendingUsers.length === 0 && (
                    <p className="text-center text-gray-500 py-4">No users are currently pending approval.</p>
                )}
                {!isLoading && !error && pendingUsers.length > 0 && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Registered</TableHead>
                                <TableHead>Email Verified</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pendingUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.first_name} {user.last_name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{formatDate(user.created_at)}</TableCell>
                                    <TableCell>
                                        {user.is_email_verified ? (
                                            <Badge variant="success" className="bg-green-100 text-green-800">Verified</Badge>
                                        ) : (
                                            <Badge variant="destructive" className="bg-red-100 text-red-800">Not Verified</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="default" // Or "outline" or "secondary"
                                            size="sm"
                                            onClick={() => handleApprove(user.id)}
                                            disabled={approvingUserId === user.id} // Disable button while processing this user
                                        >
                                            {approvingUserId === user.id ? (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            ) : (
                                                <CheckCircle className="mr-2 h-4 w-4" />
                                            )}
                                            Approve
                                        </Button>
                                        {/* Add Reject button later */}
                                        {/* <Button variant="destructive" size="sm" className="ml-2" onClick={() => handleReject(user.id)}>Reject</Button> */}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}