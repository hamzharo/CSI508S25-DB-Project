// src/pages/admin/AdminSupportTicketList.jsx
import { Link } from 'react-router-dom';
import  Button  from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';

const AdminSupportTicketList = () => {
    return (
        <div className="space-y-4">
             <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800">Manage Support Tickets</h1>
                 <Button variant="outline" size="sm" asChild>
                     <Link to="/admin/dashboard" className='flex items-center'>
                        <ArrowLeft className="mr-1 h-4 w-4" /> Back to Dashboard
                     </Link>
                 </Button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <p>Support ticket management features will be implemented here.</p>
                {/* Add API fetching, table display, actions etc. */}
                 {/* Use api.get('/admin/support'), api.put('/admin/support/:id'), etc. */}
            </div>
        </div>
    );
};
export default AdminSupportTicketList;