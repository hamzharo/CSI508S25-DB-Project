// src/pages/UserDashboard.jsx
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import { getUserAccounts } from '@/features/accounts';
import { getTransactions } from '@/features/transactions';
import BalanceChart from '@/components/dashboard/BalanceChart';

// Import UI Components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Ban } from "lucide-react";

// Import custom dashboard components
import SummaryCard from '@/components/dashboard/SummaryCard';
import RecentTransactions from '@/components/dashboard/RecentTransactions';

import Sidebar from '@/layouts/Sidebar';
import Header from '@/layouts/Header';

// Helper to format currency
const formatCurrency = (amount) => {
    const num = Number(amount);
    if (isNaN(num)) return '$--.--';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
};

const UserDashboard = () => {
    const { user } = useContext(AuthContext);
    const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
    const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
    const [error, setError] = useState(null);

    // --- Data Fetching ---
    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoadingAccounts(true);
            setIsLoadingTransactions(true);
            setError(null);
            try {
                // Fetch accounts and transactions in parallel
                const [fetchedAccounts, fetchedTransactions] = await Promise.all([
                    getUserAccounts(),
                    getTransactions()
                ]);

                // *** ADDED CONSOLE LOG TO DEBUG DATE FORMAT ***
                console.log("Raw Transactions from API:", fetchedTransactions);
                // *** END OF ADDED LOG ***

                setAccounts(fetchedAccounts || []);
                // Ensure transactions is always an array, even if API returns null/undefined
                setTransactions(Array.isArray(fetchedTransactions) ? fetchedTransactions : []);
                console.log("transactions: ", transactions);

            } catch (err) {
                console.error("Dashboard fetch error:", err);
                setError(err.response?.data?.message || err.message || "Failed to load dashboard data.");
                setAccounts([]); // Clear data on error
                setTransactions([]);
            } finally {
                setIsLoadingAccounts(false);
                setIsLoadingTransactions(false);
            }
        };
        fetchDashboardData();
    }, []); // Empty dependency array ensures this runs only once on mount

    // --- Calculated Values (Examples) ---
    const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance || 0), 0);
    const recentIncome = transactions
        .filter(t => {
            const isReceiver = accounts.some(acc => acc.account_number === t.receiverAccountNumber);
            const isSender = accounts.some(acc => acc.account_number === t.senderAccountNumber);
            return t.type === 'deposit' || (t.type === 'transfer' && isReceiver && !isSender);
         })
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);

     const recentExpenses = transactions
         .filter(t => {
             const isSender = accounts.some(acc => acc.account_number === t.senderAccountNumber);
             const isReceiver = accounts.some(acc => acc.account_number === t.receiverAccountNumber);
             return t.type === 'withdrawal' || (t.type === 'transfer' && isSender && !isReceiver);
         })
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);


    // Combined loading state for components that depend on both accounts and transactions
    const isLoading = isLoadingAccounts || isLoadingTransactions;

    return (
        <>
            <h1 className="text-2xl font-semibold text-gray-700 mb-6">
                Welcome back, {user?.firstName || 'User'}!
            </h1>
            
            {/* --- Error State --- */}
            {error && (
                <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error Loading Dashboard</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* --- Summary Cards --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <SummaryCard
                    title="Total Balance"
                    value={formatCurrency(totalBalance)}
                    icon="dollar"
                    isLoading={isLoadingAccounts}
                />
                 <SummaryCard
                    title="Recent Income"
                    value={formatCurrency(recentIncome)}
                    icon="arrow-up"
                    trend="positive"
                    isLoading={isLoadingTransactions}
                />
                 <SummaryCard
                    title="Recent Expenses"
                    value={formatCurrency(recentExpenses)}
                    icon="arrow-down"
                    trend="negative"
                    isLoading={isLoadingTransactions}
                />
                 <SummaryCard
                    title="Accounts"
                    value={accounts.length}
                    icon="bank"
                    isLoading={isLoadingAccounts}
                />
            </div>

            {/* --- Main Content Area (Chart & Recent Transactions) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Financial Overview Chart */}
                <Card className="lg:col-span-2 shadow-sm">
                    <CardHeader>
                        <CardTitle>Financial Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <BalanceChart
                            transactions={transactions}
                            accounts={accounts}
                            isLoading={isLoading}
                        />
                    </CardContent>
                </Card>

                {/* Recent Transactions List */}
                <RecentTransactions transactions={transactions} isLoading={isLoadingTransactions} className="shadow-sm" />
            </div>

            {/* --- Accounts Overview --- */}
             <h2 className="text-xl font-semibold text-gray-700 mb-4">Account Details</h2>
             {isLoadingAccounts && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <Skeleton className="h-32 w-full rounded-lg" />
                     <Skeleton className="h-32 w-full rounded-lg" />
                </div>
             )}
             {!isLoadingAccounts && accounts.length === 0 && !error && (
                <Card className="shadow-sm">
                    <CardContent className="pt-6 flex items-center justify-center flex-col text-center">
                         <Ban className="w-12 h-12 text-gray-400 mb-2" />
                        <p className="text-gray-600">No accounts found.</p>
                        <p className="text-sm text-gray-500">If you just registered, approval might be pending.</p>
                    </CardContent>
                </Card>
             )}
             {!isLoadingAccounts && accounts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {accounts.map((account) => (
                        <Card key={account.id || account.account_number} className="shadow-sm">
                             <CardHeader>
                                <CardTitle>{account.account_type || 'Account'}</CardTitle>
                                <CardDescription>
                                    ...{account.account_number?.slice(-4) || 'N/A'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-semibold">
                                    {formatCurrency(account.balance)}
                                </p>
                                <p className={`text-sm capitalize ${account.account_status === 'active' ? 'text-green-600' : 'text-orange-600'}`}>
                                     Status: {account.account_status?.replace('_', ' ') || 'Unknown'}
                                 </p>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                    size="sm"
                                    asChild
                                >
                                    <Link to={`/transactions?accountId=${account.id || account.account_number}`}>View History</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
             )}
        </>
    );
};

export default UserDashboard;