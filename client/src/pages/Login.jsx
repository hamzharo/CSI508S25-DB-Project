// client/src/pages/Login.jsx - CORRECTED
// import React, { useState, useContext } from 'react'; // Import React, useContext
import { useState, useContext } from 'react'; // Import React, useContext
import { useNavigate } from 'react-router-dom';
// import { login } from "../features/authService"; // Remove this
import { AuthContext } from '../context/AuthContext'; // Import context
import Input from "../components/ui/Input"; // Check path casing
import Button from "../components/ui/Button"; // Check path casing
import { Label } from '@/components/ui/label'; // Check path casing/import source

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // --- Get login function and loading state from context ---
    const { login, loading: authLoading } = useContext(AuthContext);
    // ---

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setError(null); // Clear previous errors

        // --- Call context login function ---
        const result = await login(email, password);
        // ---

        if (result.success) {
            // AuthContext handles setting user/token and fetching profile
            // We just need to navigate. The context will eventually update `user` state.
            // We need to wait for the context to potentially update the user role before navigating.
            // A slightly better way is to get the user info directly from the login response if needed immediately,
            // or rely on a redirect component that waits for context update.
            // For simplicity here, let's assume context updates reasonably fast or login returns role.
            // The backend login *does* return user role: { token, user: { id, email, role, firstName } }
            const loggedInUser = result.user || (await api.get('/user/profile')).data; // Fetch if not returned directly by context's login
             if (loggedInUser?.role === "admin") {
                navigate("/admin-dashboard"); // Navigate to admin page
             } else {
                navigate("/user-dashboard"); // Navigate to user page
             }
        } else {
            setError(result.message || "Login failed. Please check your credentials.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
             <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-900">Login</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <form onSubmit={handleLogin} className="space-y-4">
                     <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            placeholder="you@example.com"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1"
                        />
                     </div>
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1"
                        />
                     </div>
                     {/* Add forgot password link */}
                     {/* <div className="text-sm text-right">
                         <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                             Forgot password?
                         </Link>
                     </div> */}
                     <Button type="submit" className="w-full" disabled={authLoading}>
                        {authLoading ? "Logging in..." : "Login"}
                    </Button>
                </form>
             </div>
        </div>
    );
}