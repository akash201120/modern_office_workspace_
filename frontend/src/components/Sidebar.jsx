import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="d-flex flex-column bg-light p-3 vh-100" style={{ width: "250px" }}>
      <h4 className="text-center">Menu</h4>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link className="nav-link" to="/dashboard">🏠 Dashboard</Link>
        </li>
        
        <li className="nav-item">
          <Link className="nav-link" to="/tasks">📋 Tasks</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/staff">🧹 Staff</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/reports">📊 Reports</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/settings">⚙️ Settings</Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
