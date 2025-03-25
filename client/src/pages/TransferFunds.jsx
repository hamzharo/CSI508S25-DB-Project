// client/src/pages/TransferFunds.jsx
// import React, { useState } from "react";
import { useState } from "react";
import { transferFunds } from "../features/transactions";
import Navbar from "../components/Navbar";

export default function TransferFunds() {
  const [receiverId, setReceiverId] = useState("");
  const [amount, setAmount] = useState("");

  const handleTransfer = async () => {
    const response = await transferFunds(receiverId, amount);
    alert(response.message);
  };

  return (
    <div>
      <Navbar />
      <div className="p-5">
        <h2 className="text-2xl font-bold">Transfer Funds</h2>
        <input type="text" placeholder="Receiver ID" onChange={(e) => setReceiverId(e.target.value)} />
        <input type="number" placeholder="Amount" onChange={(e) => setAmount(e.target.value)} />
        <button onClick={handleTransfer}>Transfer</button>
      </div>
    </div>
  );
}
