// client/src/pages/Register.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { sendVerificationEmail } from "../utils/api";
// import Input from "../components/ui/Input";
// import Button from "../components/ui/Button";
import RegisterForm from "../components/RegisterForm";

export default function Register() {
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();

//   const handleEmailSubmit = async () => {
//     try {
//       const res = await sendVerificationEmail({ email });
//       setMessage(res.message || "Verification link sent.");
//     } catch (err) {
//       setMessage("Something went wrong. Please try again.");
//     }
//   };

  return (
    <div className="flex flex-col items-center min-h-screen py-10 bg-gray-50">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Start Registration</h2>
      {/* <Input
        placeholder="Enter your email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button onClick={handleEmailSubmit} className="mt-3">
        Send Verification Link
      </Button> */}
      <RegisterForm />
      {/* {message && <p className="mt-4 text-sm text-gray-600">{message}</p>} */}
    </div>
  );
}



// // src/pages/Register.jsx

// import { Link } from 'react-router-dom';
// import RegisterForm from '../components/RegisterForm'; // Adjust path if necessary

// // --- Reusable Components (Consider moving to a shared file) ---

// // Consistent Logo component (Matches Login.jsx)
// const CompanyLogo = () => (
//     <div className="text-white font-bold text-3xl lg:text-4xl tracking-wider mb-8 leading-tight">
//         ONLINE BANK<br/>MANAGEMENT SYSTEM
//         {/* Or use an actual logo image: <img src="/logo.png" alt="Online Bank Management System" className="h-10 w-auto" /> */}
//     </div>
// );

// // --- Main Page Component ---

// export default function Register() {
//   return (
//     // --- Main container: Split screen layout ---
//     <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen font-sans">

//         {/* === Left Column: Informational Panel === */}
//         <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-cyan-400 to-blue-600 p-8 lg:p-16 text-white">
//             {/* Top: Logo */}
//             <div className="flex-shrink-0">
//                 <CompanyLogo />
//             </div>

//             {/* Middle: Welcome Text (Registration Specific) */}
//             <div className="flex-grow flex items-center">
//                  <div className="w-full max-w-md">
//                     <h1 className="text-4xl lg:text-5xl font-bold mb-4">
//                         Join SecureBank
//                     </h1>
//                     <p className="text-lg lg:text-xl text-blue-100 leading-relaxed">
//                         Create your account in minutes and start managing your finances securely online. Access all our features upon successful registration.
//                     </p>
//                 </div>
//             </div>

//             {/* Bottom: Footer Text */}
//             <div className="flex-shrink-0">
//                 <p className="text-sm text-blue-200">
//                     Your trusted partner in digital banking.
//                 </p>
//             </div>
//         </div>
//         {/* === End Left Column === */}


//         {/* === Right Column: Registration Form Area === */}
//         <div className="flex items-center justify-center bg-white p-8 sm:p-12 lg:p-16">
//             {/* Content Container */}
//             <div className="w-full max-w-md space-y-8"> {/* Adjusted max-width to md for slightly more space if needed, or keep sm */}

//                 {/* Back Navigation */}
//                 <div> {/* Wrapped in div for layout consistency */}
//                     <Link to="/" className="text-sm text-gray-500 hover:text-blue-600 hover:underline transition-colors duration-150">
//                         ← Back to Home
//                     </Link>
//                  </div>

//                 {/* Registration Header */}
//                 <div>
//                     <h2 className="text-3xl font-bold text-blue-600 mb-1">
//                         Create Your Account
//                     </h2>
//                     <p className="text-sm text-gray-500">
//                         Fill in the details below to get started.
//                     </p>
//                 </div>

//                 {/* --- Registration Form Component --- */}
//                 {/* This component contains the actual input fields and submit logic */}
//                 <div className="pt-2"> {/* Added slight padding top for spacing */}
//                     <RegisterForm />
//                 </div>
//                 {/* --- End Registration Form Component --- */}

//                 {/* Footer Link: Navigate to Login */}
//                 <div className="text-center text-sm text-gray-600 pt-6 border-t border-gray-200"> {/* Added border-t for visual separation */}
//                     Already have an account?{' '}
//                     <Link
//                         to="/login"
//                         className="font-semibold text-blue-600 hover:text-blue-500 hover:underline"
//                     >
//                         Login Here
//                     </Link>
//                 </div>

//             </div>
//             {/* End Content Container */}
//         </div>
//         {/* === End Right Column === */}

//     </div>
//     // --- End Main container ---
//   );
// }