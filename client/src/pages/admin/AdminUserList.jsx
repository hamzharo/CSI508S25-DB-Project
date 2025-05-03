// src/pages/admin/AdminUserList.jsx
import { useState, useEffect, useCallback } from 'react';
import { Link /*, useNavigate */ } from 'react-router-dom'; // Add useNavigate if needed for actions
import api from '../../utils/api'; // Adjust path if needed
import Button from '@/components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, AlertTriangle, Pencil, Eye, Trash2, ArrowLeft } from 'lucide-react'; // Added Trash2, ArrowLeft
import { toast } from 'react-hot-toast';
// import ConfirmationModal from '@/components/ConfirmationModal'; // Example for delete confirmation

const AdminUserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // const navigate = useNavigate(); // For navigation on edit/view
    // const [showDeleteModal, setShowDeleteModal] = useState(false);
    // const [userToDelete, setUserToDelete] = useState(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/admin/users'); // Uses GET /api/admin/users
            setUsers(response.data);
        } catch (err) {
            console.error("Error fetching users:", err);
            const errorMessage = err.response?.data?.message || "Failed to load users.";
            setError(errorMessage);
            setUsers([]);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // --- Action Handlers (Placeholders - Implement fully later) ---
    const handleEditUser = (userId) => {
        toast.info(`Edit action for user ID: ${userId} (not implemented)`);
        // navigate(`/admin/users/edit/${userId}`); // Example navigation
    };

    const handleViewUser = (userId) => {
        toast.info(`View details for user ID: ${userId} (not implemented)`);
        // navigate(`/admin/users/view/${userId}`); // Example navigation
    };

    const handleDeleteUser = (userId) => {
         // Basic confirmation
         if (window.confirm(`Are you sure you want to delete user ID: ${userId}? This action cannot be undone.`)) {
             toast.info(`Delete action for user ID: ${userId} (not implemented)`);
            // Call API: api.delete(`/admin/users/${userId}`)
            // Then refetch users or remove from state
         }

        // --- OR Using a Modal ---
        // setUserToDelete(userId);
        // setShowDeleteModal(true);
    };

    // const confirmDelete = async () => {
    //     if (!userToDelete) return;
    //     try {
    //         // await api.delete(`/admin/users/${userToDelete}`);
    //         toast.success(`User ${userToDelete} deleted.`);
    //         setUsers(prev => prev.filter(u => u.id !== userToDelete));
    //     } catch (err) {
    //         toast.error(err.response?.data?.message || `Failed to delete user ${userToDelete}.`);
    //     } finally {
    //         setShowDeleteModal(false);
    //         setUserToDelete(null);
    //     }
    // };
    // --- End Action Handlers ---


    // --- Render Logic ---
    let content;
    if (loading) {
        content = (
            <div className="flex justify-center items-center p-10">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                 <span className="ml-3 text-gray-600">Loading Users...</span>
            </div>
        );
    } else if (error) {
        content = (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4 flex items-center" role="alert">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                <span className="block sm:inline">{error}</span>
            </div>
        );
    } else if (users.length === 0) {
        content = <p className="text-center text-gray-500 py-6">No users found.</p>;
    } else {
        content = (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[80px]">ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined On</TableHead>
                        <TableHead className="text-right w-[150px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map(user => (
                        <TableRow key={user.id}>
                             <TableCell className="font-medium">{user.id}</TableCell>
                            <TableCell>{user.first_name} {user.last_name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell className="capitalize">{user.role}</TableCell>
                            <TableCell>
                                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                                    user.status === 'approved' ? 'bg-green-100 text-green-800' :
                                    user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    user.status === 'suspended' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                    {user.status}
                                </span>
                            </TableCell>
                             <TableCell>
                                {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                            </TableCell>
                            <TableCell className="text-right space-x-1">
                                <Button variant="ghost" size="icon" onClick={() => handleViewUser(user.id)} title="View Details">
                                    <Eye className="h-4 w-4 text-blue-600" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleEditUser(user.id)} title="Edit User">
                                    <Pencil className="h-4 w-4 text-yellow-600" />
                                </Button>
                                 <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user.id)} title="Delete User">
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    }
     // --- End Render Logic ---

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
                 <Button variant="outline" size="sm" asChild>
                     <Link to="/admin/dashboard" className='flex items-center'>
                        <ArrowLeft className="mr-1 h-4 w-4" /> Back to Dashboard
                     </Link>
                 </Button>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                 <div className="p-4 md:p-0">{content}</div>
            </div>
             {/* Optional: Confirmation Modal */}
             {/* {showDeleteModal && (
                 <ConfirmationModal
                     title="Confirm Deletion"
                     message={`Are you sure you want to delete user ID: ${userToDelete}?`}
                     onConfirm={confirmDelete}
                     onCancel={() => setShowDeleteModal(false)}
                 />
             )} */}
        </div>
    );
};

export default AdminUserList;