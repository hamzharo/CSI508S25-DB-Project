import { useState, useEffect } from "react";
import EmailVerificationForm from "../components/EmailVerificationForm";
import RegisterForm from "../components/RegisterForm";
import { jwtDecode } from "jwt-decode";

export default function VerifyEmail() {
  const [verifiedEmail, setVerifiedEmail] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");

    if (token) {
      try {
        const { email } = jwtDecode(token);
        setVerifiedEmail(email);
      } catch (error) {
        console.error(error);
      }
    }
  }, []);


  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {verifiedEmail}
      {verifiedEmail
        ? <RegisterForm email={verifiedEmail} />
        : <EmailVerificationForm onVerified={setVerifiedEmail} />
      }
    </div>
  );
}
