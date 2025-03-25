// client/src/pages/Register.jsx
// import React, { useState } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../features/auth";
import Input from "../components/Input";
import Button from "../components/Button";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    const response = await register(name, email, password);
    if (response.success) {
      navigate("/login");
    } else {
      alert(response.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold">Register</h2>
      <Input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
      <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button onClick={handleRegister} className="mt-2">Register</Button>
    </div>
  );
}
