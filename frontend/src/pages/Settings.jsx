import React from "react";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";

export default function Settings() {
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
          <h2>Settings</h2>
          <p>Manage your account settings here.</p>
        </div>
      </div>
    </div>
  );
}
