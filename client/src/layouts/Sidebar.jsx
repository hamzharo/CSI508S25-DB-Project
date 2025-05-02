// // src/components/layout/Sidebar.jsx
// import { useContext } from 'react';
// import { NavLink, Link, useNavigate } from 'react-router-dom';
// import { AuthContext } from '@/context/AuthContext'; // Use alias if configured
// import Button from '@/components/ui/Button'; // Use alias

// // Import icons (example using lucide-react, install it: npm install lucide-react)
// import { LayoutDashboard, ArrowLeftRight, User, Settings, LogOut, ShieldAlert, Users, Building, Ticket, FileWarning } from 'lucide-react';

// const commonLinkClass = "flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100";
// const activeLinkClass = "bg-gray-200 font-semibold"; // Style for active NavLink

// export default function Sidebar() {
//     const { user, logout, isAdmin } = useContext(AuthContext);
//     const navigate = useNavigate();

//     const handleLogout = () => {
//         logout();
//         navigate('/login'); // Redirect to login after logout
//     };

//     // Define navigation links based on role
//     const customerLinks = [
//         { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
//         { path: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
//         { path: '/transfer', label: 'Transfer', icon: ArrowLeftRight }, // Use appropriate icon
//         // { path: '/profile', label: 'Profile', icon: User }, // Settings page might cover this
//         { path: '/settings', label: 'Settings/Profile', icon: Settings },
//         // Add Support/Fraud links when pages are ready
//          { path: '/support', label: 'Support Tickets', icon: Ticket },
//          { path: '/fraud-report', label: 'Report Fraud', icon: FileWarning },
//     ];

//     const adminLinks = [
//         { path: '/admin/dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
//         { path: '/admin/users', label: 'User Management', icon: Users },
//         { path: '/admin/branches', label: 'Branch Management', icon: Building },
//         { path: '/admin/support', label: 'Support Tickets', icon: Ticket },
//         { path: '/admin/fraud', label: 'Fraud Reports', icon: ShieldAlert },
//         { path: '/settings', label: 'Settings', icon: Settings }, // Admin might have settings too
//     ];

//     const links = isAdmin ? adminLinks : customerLinks;

//     return (
//         <aside className="w-64 min-h-screen bg-white border-r p-4 flex flex-col shadow-lg"> {/* Added shadow */}
//             {/* Logo/User Info */}
//             <div className="mb-8 text-center">
//                 <Link to={isAdmin ? '/admin/dashboard' : '/dashboard'} className="text-2xl font-bold text-gray-800">
//                     MyBank
//                 </Link>
//                 {user && (
//                     <div className='mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm'> {/* User info card */}
//                          <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center mx-auto mb-2 text-xl font-semibold">
//                             {user.firstName?.charAt(0).toUpperCase() || '?'}
//                         </div>
//                         <p className="text-sm font-semibold text-gray-700">
//                             {user.firstName} {user.lastName}
//                         </p>
//                         <p className="text-xs text-gray-500">{user.email}</p>
//                         <span className={`mt-1 inline-block px-2 py-0.5 text-xs font-medium rounded-full ${isAdmin ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
//                             {user.role}
//                         </span>
//                     </div>
//                 )}
//             </div>

//             {/* Navigation Links */}
//             <nav className="flex-grow space-y-2">
//                 {links.map(({ path, label, icon: Icon }) => (
//                     <NavLink
//                         key={path}
//                         to={path}
//                         className={({ isActive }) =>
//                             `${commonLinkClass} ${isActive ? activeLinkClass : ''}`
//                         }
//                     >
//                         <Icon className="mr-3 h-5 w-5" />
//                         {label}
//                     </NavLink>
//                 ))}
//             </nav>

//             {/* Logout Button */}
//             <div className="mt-auto">
//                  <Button variant="outline" className="w-full flex items-center justify-center" onClick={handleLogout}>
//                      <LogOut className="mr-2 h-5 w-5" /> Logout
//                  </Button>
//             </div>
//         </aside>
//     );
// }



// src/components/layout/Sidebar.jsx
import { useContext } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import { LayoutDashboard, ArrowLeftRight, User, Settings, LogOut, Ticket, FileWarning, /* Add other needed icons */ } from 'lucide-react';

// Adjusted classes for dark sidebar
const commonLinkClass = "flex items-center px-4 py-2 rounded-md text-gray-200 hover:bg-gray-700"; // Lighter text, darker hover
const activeLinkClass = "bg-gray-600 font-semibold text-white"; // Active state for dark bg

export default function Sidebar() {
    const { user, logout, isAdmin } = useContext(AuthContext); // isAdmin check might not be needed if this is only UserLayout
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Customer links (adjust icons as needed)
    const customerLinks = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/profile', label: 'Profile', icon: User }, // Combined Profile/Settings
        { path: '/accounts', label: 'Accounts', icon: LayoutDashboard }, // Placeholder - Add Accounts Page
        // { path: '/cards', label: 'Cards', icon: CreditCard }, // Placeholder
        { path: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
         { path: '/transfer', label: 'Transfer', icon: ArrowLeftRight }, // Use appropriate icon
        { path: '/settings', label: 'Settings', icon: Settings },
        // Add Support/Fraud links if pages exist
        // { path: '/support', label: 'Support Tickets', icon: Ticket },
        // { path: '/fraud-report', label: 'Report Fraud', icon: FileWarning },
    ];

    // If this Sidebar is *only* for customers, you don't need adminLinks/isAdmin check here
    const links = customerLinks;

    return (
         // Change background, width, text colors
        <aside className="w-60 min-h-screen bg-gray-800 text-gray-300 p-4 flex flex-col shadow-lg"> {/* Dark background, slightly narrower */}
            {/* User Info Area - Optional: Simplify or keep the card */}
             <div className="mb-8 text-center">
                 {user && (
                     <div className='mt-4 p-3 bg-gray-700 rounded-lg shadow-sm'> {/* Darker card */}
                         {/* Same initial circle */}
                         <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center mx-auto mb-2 text-xl font-semibold">
                             {user.firstName?.charAt(0).toUpperCase() || '?'}
                         </div>
                         <p className="text-sm font-semibold text-white"> {/* White text */}
                             {user.firstName} {user.lastName}
                         </p>
                         <p className="text-xs text-gray-400">{user.email}</p> {/* Lighter grey */}
                          <span className={`mt-1 inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-green-200 text-green-900`}> {/* Adjusted badge for dark bg */}
                             {user.role}
                         </span>
                     </div>
                 )}
             </div>


            {/* Navigation Links */}
            <nav className="flex-grow space-y-1"> {/* Reduced space */}
                {links.map(({ path, label, icon: Icon }) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) =>
                            `${commonLinkClass} ${isActive ? activeLinkClass : ''}`
                        }
                    >
                        <Icon className="mr-3 h-5 w-5" />
                        {label}
                    </NavLink>
                ))}
            </nav>

            {/* Logout Button */}
            <div className="mt-auto pt-4 border-t border-gray-700"> {/* Darker border */}
                 <Button
                    variant="ghost" // Ghost or outline might look better on dark
                    className="w-full flex items-center justify-center text-gray-300 hover:bg-red-700 hover:text-white" // Logout specific style
                    onClick={handleLogout}
                 >
                     <LogOut className="mr-2 h-5 w-5" /> Logout
                 </Button>
            </div>
        </aside>
    );
}