import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import VerifyEmail from "./pages/VerifyEmail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Terms from "./pages/Terms"

function App() {
  return (
   // <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
   // </Router>
  );
}

export default App;