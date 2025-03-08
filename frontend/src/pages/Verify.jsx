import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function Verify() {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (!storedEmail) {
      toast.error("No email found. Please sign up again.");
      navigate("/signup");
    }
    setEmail(storedEmail);
  }, [navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/verify-email", { 
        email, 
        verificationToken: code 
      });
      
      toast.success(response.data.message || "Verification successful!");
      localStorage.removeItem("userEmail"); // Clean up stored email
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleVerify} className="p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-bold mb-4">Verify Your Account</h2>
        <input 
          type="text" 
          placeholder="Verification Code" 
          className="input" 
          value={code} 
          onChange={(e) => setCode(e.target.value)} 
          required 
        />
        <button type="submit" className="btn">Verify</button>
      </form>
    </div>
  );
}
