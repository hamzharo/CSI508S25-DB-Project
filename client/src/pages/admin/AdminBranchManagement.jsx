// src/pages/admin/AdminBranchManagement.jsx
import { Link } from 'react-router-dom';
import  Button  from '@/components/ui/Button'; // Adjust path if needed
import { ArrowLeft } from 'lucide-react';

const AdminBranchManagement = () => {
    return (
        <div className="space-y-4">
             <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800">Manage Branches</h1>
                 <Button variant="outline" size="sm" asChild>
                     <Link to="/admin/dashboard" className='flex items-center'>
                        <ArrowLeft className="mr-1 h-4 w-4" /> Back to Dashboard
                     </Link>
                 </Button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <p>Branch management features (listing, adding, editing) will be implemented here.</p>
                {/* Fetch branches using api.get('/branches') or api.get('/admin/branches') depending on your backend */}
            </div>
        </div>
    );
};
export default AdminBranchManagement;