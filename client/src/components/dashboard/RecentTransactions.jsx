// src/components/dashboard/RecentTransactions.jsx
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from 'lucide-react'; // Icon for link

// Helper to format currency (could be moved to a utils file)
const formatCurrency = (amount) => {
     const num = Number(amount);
     if (isNaN(num)) return '$--.--';
     return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
};

 // Helper to format date (could be moved to a utils file)
 const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
         return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
         return 'Invalid Date';
    }
 };


const RecentTransactions = ({ transactions = [], isLoading, limit = 5 }) => {
    const displayedTransactions = transactions.slice(0, limit);

    // Determine transaction type/description (adapt based on your actual transaction data structure)
    const getTransactionDetails = (txn) => {
        console.group("txn is: ", txn);
        let description = txn.description || 'Transaction';
        let amount = Number(txn.amount) || 0;
        let date = txn.timestamp;
        let isPositive = false;

        if (txn.type === 'deposit') {
             description = txn.description || 'Deposit';
             isPositive = true;
        } else if (txn.type === 'withdrawal') {
             description = txn.description || 'Withdrawal';
             isPositive = false;
             amount = -amount; // Show as negative
        } else if (txn.type === 'transfer') {
            // This needs refinement based on whether the current user is sender or receiver
            // For simplicity, assuming 'description' field holds useful info or we show generic transfer
            description = txn.description || `Transfer ${txn.senderAccountNumber ? 'to '+txn.receiverAccountNumber : 'from '+txn.senderAccountNumber}`;
            // We need context of which account we're viewing from, for now just show amount
             // isPositive depends on perspective - cannot determine here easily without account context
        }

         return { description, amount, date, isPositive };
    };


    return (
        <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                     <Link to="/transactions" className="text-sm text-blue-600 hover:underline">
                        View All <ArrowRight className="ml-1 h-4 w-4 inline" />
                     </Link>
                </Button>
            </CardHeader>
            <CardContent>
                {isLoading && (
                    <div className="space-y-4">
                        {[...Array(limit)].map((_, i) => (
                             <div key={i} className="flex justify-between items-center">
                                 <div className="space-y-1">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-3 w-16" />
                                </div>
                                <Skeleton className="h-5 w-20" />
                             </div>
                        ))}
                    </div>
                )}
                {!isLoading && transactions.length === 0 && (
                     <p className="text-sm text-gray-500 text-center py-4">No recent transactions found.</p>
                )}
                {!isLoading && transactions.length > 0 && (
                    <ul className="space-y-4">
                        {displayedTransactions.map((txn) => {
                            const { description, amount, date, isPositive } = getTransactionDetails(txn);
                            // Determine color based on amount sign AFTER determining description
                            const amountColor = amount >= 0 ? 'text-green-600' : 'text-red-600';
                            const formattedAmount = `${amount >= 0 ? '+' : ''}${formatCurrency(amount)}`;

                             return (
                                <li key={txn._id || txn.id} className="flex justify-between items-center">
                                     <div>
                                        <p className="text-sm font-medium capitalize">{description}</p>
                                        <p className="text-xs text-gray-500">{formatDate(date)}</p>
                                    </div>
                                     <span className={`text-sm font-semibold ${amountColor}`}>
                                        {formattedAmount}
                                    </span>
                                </li>
                             );
                        })}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
};

export default RecentTransactions;