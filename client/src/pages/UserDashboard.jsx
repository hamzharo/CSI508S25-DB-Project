// src/pages/UserDashboard.jsx
//import React, { useState, useEffect, useContext } from 'react';
import  { useState, useEffect, useContext } from 'react';

import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getUserAccounts } from '../features/accounts'; // Import the API function

// Import Shadcn UI Components (adjust paths as needed)
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/Button";
// Optional: For loading/error states
// import { Skeleton } from "@/components/ui/skeleton";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Terminal } from "lucide-react"; // Example icon

const UserDashboard = () => {
    const { user } = useContext(AuthContext); // Get user info for welcome message
    const [accounts, setAccounts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch accounts when the component mounts
    useEffect(() => {
        const fetchAccounts = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const fetchedAccounts = await getUserAccounts();
                setAccounts(fetchedAccounts || []); // Ensure accounts is always an array
            } catch (err) {
                setError(err.response?.data?.message || err.message || "Failed to load account details.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAccounts();
    }, []); // Empty dependency array means run once on mount

    // Helper to format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">
                Welcome back, {user?.firstName || 'User'}!
            </h1>

            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Account Summary</h2>

            {isLoading && (
                // --- Loading State ---
                <div className="space-y-4">
                     <p>Loading accounts...</p>
                     {/* Optional: Add Skeleton loaders for better UX */}
                     {/* <Skeleton className="h-24 w-full rounded-lg" />
                     <Skeleton className="h-24 w-full rounded-lg" /> */}
                </div>
            )}

            {error && (
                 // --- Error State ---
                 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error! </strong>
                    <span className="block sm:inline">{error}</span>
                 </div>
                // Or use Shadcn Alert component:
                // <Alert variant="destructive">
                //     <Terminal className="h-4 w-4" />
                //     <AlertTitle>Error Loading Accounts</AlertTitle>
                //     <AlertDescription>{error}</AlertDescription>
                // </Alert>
            )}

            {!isLoading && !error && (
                // --- Success State ---
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {accounts.length > 0 ? (
                        accounts.map((account) => (
                            <Card key={account.id} className="shadow-md">
                                <CardHeader>
                                    <CardTitle>{account.account_type}</CardTitle>
                                    <CardDescription>
                                        Account ending in {account.account_number?.slice(-4) || 'N/A'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-semibold">
                                        {formatCurrency(account.balance)}
                                    </p>
                                
                                    <p className={`text-sm ${account.account_status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                                        Status: {account.account_status} {/* <-- Use account_status here */}
                                    </p>

                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    {/* Placeholder for future actions */}
                                    <Button variant="outline" size="sm" asChild>
                                        <Link to={`/transactions?accountId=${account.id}`}>View History</Link>
                                    </Button>
                                    {/* <Button size="sm">Details</Button> */}
                                </CardFooter>
                            </Card>
                        ))
                    ) : (
                        <p className="text-gray-600 md:col-span-2 lg:col-span-3">
                            You do not have any accounts yet. If this seems incorrect, please contact support.
                        </p>

                    )}
                </div>
            )}

            {/* Quick Actions Section */}
            <div className="mt-8 pt-6 border-t">
                <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
                <div className="flex space-x-4">
                    <Button asChild>
                        <Link to="/transfer">Make a Transfer</Link>
                    </Button>
                    <Button variant="secondary" asChild>
                         <Link to="/transactions">View All Transactions</Link>
                    </Button>
                     {/* Add Deposit/Withdrawal buttons if applicable */}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;

