import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function Reports() {
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
          <h2>Reports</h2>
          <p>View analytics and generate reports here.</p>
        </div>
      </div>
    </div>
  );
}
