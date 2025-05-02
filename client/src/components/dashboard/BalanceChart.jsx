// src/components/dashboard/BalanceChart.jsx
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

// Helper to format date for X-axis (adjust as needed)
const formatDateTick = (dateString) => {
    try {
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
        return '';
    }
};

// Helper to format currency for Tooltip/Y-axis
const formatCurrency = (value) => {
     if (typeof value !== 'number') return '$--';
     return `$${value.toLocaleString()}`;
 };


const BalanceChart = ({ transactions = [], accounts = [], isLoading }) => {
    const [chartData, setChartData] = useState([]);

    // Process data when transactions or accounts change
    // NOTE: This is a SIMPLIFIED example. Real balance charting often needs
    // historical balance snapshots or more complex calculations from transactions.
    // This example just plots transaction amounts over time.
    useEffect(() => {
        if (!transactions || transactions.length === 0) {
            setChartData([]);
            return;
        }

        // Sort transactions by date ascending
        const sortedTxns = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

        // Create simplified data points (date and amount)
        // A better chart would show running balance, which requires knowing the starting balance.
        const processedData = sortedTxns.map(txn => {
             // Determine if it's income or expense relative to the user
             let amount = Number(txn.amount || 0);
             let income = 0;
             let expense = 0;

             // Rough check - needs refinement based on user's account numbers
             const isSender = accounts.some(acc => acc.account_number === txn.senderAccountNumber);
             const isReceiver = accounts.some(acc => acc.account_number === txn.receiverAccountNumber);

             if (txn.type === 'deposit' || (txn.type === 'transfer' && isReceiver && !isSender)) {
                 income = amount;
             } else if (txn.type === 'withdrawal' || (txn.type === 'transfer' && isSender && !isReceiver)) {
                  expense = amount; // Keep expense positive for plotting maybe? Or use negative line.
             } else {
                 // Ambiguous transfer or other type - might ignore or handle differently
             }

            return {
                 date: txn.date, // Keep original date string for sorting/processing
                 // amount: amount, // Could plot raw amount
                 income: income,
                 expense: expense,
                 // You would calculate runningBalance here if you had a starting point
             };
         });

         // Optional: Aggregate by day/week/month for cleaner charts if many transactions
         // For simplicity, we'll use raw points for now.

        setChartData(processedData);

    }, [transactions, accounts]); // Re-process if transactions or accounts change

    if (isLoading) {
         return <Skeleton className="h-64 w-full" />;
     }

     if (chartData.length === 0) {
         return <div className="h-64 flex items-center justify-center bg-gray-50 rounded text-gray-500">No transaction data available for chart.</div>;
     }


    return (
        // ResponsiveContainer makes the chart adapt to parent size
        <ResponsiveContainer width="100%" height={250}>
            <LineChart
                data={chartData}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20, // Increased left margin for Y-axis labels
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                    dataKey="date"
                    tickFormatter={formatDateTick}
                    tick={{ fontSize: 12, fill: '#6b7280' }} // Style tick labels
                    axisLine={{ stroke: '#d1d5db' }}
                    tickLine={{ stroke: '#d1d5db' }}
                />
                 <YAxis
                     tickFormatter={formatCurrency}
                     tick={{ fontSize: 12, fill: '#6b7280' }}
                     axisLine={{ stroke: '#d1d5db' }}
                     tickLine={{ stroke: '#d1d5db' }}
                     // Optional: Set domain if needed, e.g., [0, 'auto'] or ['auto', 'auto']
                 />
                <Tooltip
                    formatter={(value, name) => [`${formatCurrency(value)}`, `${name.charAt(0).toUpperCase() + name.slice(1)}`]}
                    labelFormatter={(label) => formatDateTick(label)} // Format date in tooltip label
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '4px', padding: '5px 10px' }} // Style tooltip
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}/>
                {/* Plot Income */}
                 <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} activeDot={{ r: 6 }} dot={{ r: 3 }} name="Income" />
                 {/* Plot Expenses */}
                 <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} activeDot={{ r: 6 }} dot={{ r: 3 }} name="Expenses" />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default BalanceChart;