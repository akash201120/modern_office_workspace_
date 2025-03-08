import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import { useEffect } from "react";

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="w-100">
        {/* Navbar */}
        <Navbar />

        {/* Content */}
        <div className="container mt-4">
          <h2>Welcome to the Dashboard</h2>
          <p>This is your main dashboard content.</p>
          <button onClick={handleLogout} className="btn btn-danger mt-3">Logout</button>
        </div>
      </div>
    </div>
  );
}
