import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Verify from "./pages/Verify";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import Settings from "./pages/Settings";
import Tasks from "./pages/Tasks";
import Staffs from "./pages/Staff";
import Reports from "./pages/Reports";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Routes>
        <Route path="/" element={<Navigate to="/signup" />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify" element={<Verify />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path ="/settings" element={<Settings/>}/>
      <Route path ="/tasks" element={<Tasks/>}/>
      <Route path ="/staff" element={<Staffs/>}/>
      <Route path ="/reports" element={<Reports/>}/>
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;

