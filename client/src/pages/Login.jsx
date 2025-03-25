// client/src/pages/Login.jsx
// import React, { useState } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../features/auth";
import Input from "../components/Input";
import Button from "../components/Button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const response = await login(email, password);
    if (response.success) {
      navigate(response.role === "admin" ? "/admin-dashboard" : "/user-dashboard");
    } else {
      alert(response.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold">Login</h2>
      <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button onClick={handleLogin} className="mt-2">Login</Button>
    </div>
  );
}
