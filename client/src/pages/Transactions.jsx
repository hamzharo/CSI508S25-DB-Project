// client/src/pages/Transactions.jsx
// import React, { useEffect, useState } from "react";
import { useEffect, useState } from "react";
import { getTransactions } from "../features/transactions";
import Navbar from "../components/Navbar";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    async function fetchTransactions() {
      const data = await getTransactions();
      setTransactions(data);
    }
    fetchTransactions();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="p-5">
        <h2 className="text-2xl font-bold">Transaction History</h2>
        <ul className="mt-4">
          {transactions.map((txn) => (
            <li key={txn._id} className="border p-2 my-2">
              {txn.senderId} sent ${txn.amount} to {txn.receiverId} on {new Date(txn.date).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
