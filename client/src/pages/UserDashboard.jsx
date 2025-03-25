// client/src/pages/UserDashboard.jsx
// import React, { useEffect, useState } from "react";
import { useEffect, useState } from "react";
import { getUserProfile } from "../features/user";
import Navbar from "../components/Navbar";

export default function UserDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      const profile = await getUserProfile();
      setUser(profile);
    }
    fetchProfile();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="p-5">
        <h2 className="text-2xl font-bold">User Dashboard</h2>
        {user ? (
          <div className="mt-4">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Balance:</strong> ${user.balance}</p>
          </div>
        ) : <p>Loading...</p>}
      </div>
    </div>
  );
}
