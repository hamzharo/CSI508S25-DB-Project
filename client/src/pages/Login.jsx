
// src/pages/Login.jsx
//import React, { useState, useContext } from 'react'; // Import React
import  { useState, useContext } from 'react'; // Import React

import { useNavigate, useLocation, Link } from 'react-router-dom'; // Import useLocation and Link
import { AuthContext } from '../context/AuthContext'; // Import context
import Input from "../components/ui/Input";    // Use correct alias/casing
import Button from "../components/ui/Button";   // Use correct alias/casing
import { Label } from "../components/ui/Label";   // Use correct alias/casing

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' }); // Use state object
    const [error, setError] = useState(null);
    // We don't need local isLoading if AuthContext provides it
    // const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation(); // Get location state if redirected here

    // Get login function and loading state from context
    const { login, loading: authLoading } = useContext(AuthContext);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        // No need to set local isLoading if using authLoading from context

        // Call context login function
        const result = await login(formData.email, formData.password);

        // --- REMOVE direct API call and role check here ---

        if (result.success) {
            console.log("Login component: Context login reported success.");
            // SUCCESS! AuthContext will update. ProtectedRoute will handle the redirect.
            // If we were redirected TO login, navigate back to original destination.
            const from = location.state?.from?.pathname || null; // Get original path if available

            // Determine default dashboard based on *potential* role (context might not be updated yet)
            // It's often better to just navigate '/' and let ProtectedRoute figure it out,
            // but redirecting back to 'from' is good UX.
            if (from) {
                 console.log(`Login success, navigating back to: ${from}`);
                 navigate(from, { replace: true });
            } else {
                 // If no 'from' location, navigate to a default root/dashboard.
                 // ProtectedRoute will then evaluate and send to correct dashboard.
                 console.log('Login success, navigating to root /');
                 navigate('/', { replace: true });
                 // Or navigate('/dashboard') - customer default
                 // Or navigate based on result.user.role IF the context login function returns it reliably
            }
        } else {
            // Login failed (handled by backend check or context catch block)
            setError(result.message || "Login failed. Please check credentials or account status.");
            // State is cleared within AuthContext's login catch block
        }
        // No need for local setIsLoading(false) if using authLoading
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
             <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-900">Login</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email" // Use id for label linking
                            placeholder="you@example.com"
                            type="email"
                            value={formData.email} // Use formData state
                            onChange={handleChange} // Use shared handler
                            required
                            className="mt-1"
                        />
                     </div>
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password" // Use id for label linking
                            placeholder="Password"
                            type="password"
                            value={formData.password} // Use formData state
                            onChange={handleChange} // Use shared handler
                            required
                            className="mt-1"
                        />
                     </div>
                     {/* Optional: Forgot password link */}
                     {/* ... */}
                     <Button type="submit" className="w-full" disabled={authLoading}>
                        {authLoading ? "Logging in..." : "Login"}
                    </Button>
                    {/* Optional: Link to Register */}
                    <p className="text-sm text-center text-gray-600">
                           Don't have an account? <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">Register</Link>
                    </p>
                </form>
             </div>
        </div>
    );
}