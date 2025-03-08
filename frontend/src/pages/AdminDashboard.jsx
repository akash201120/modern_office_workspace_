import React, { useEffect, useState } from "react";
import CreateTaskForm from "../components/CreateTaskForm";

const AdminDashboard = () => {
    const [token, setToken] = useState("");

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) setToken(storedToken);
    }, []);

    return (
        <div className="container">
            <h2>Admin Dashboard</h2>
            {token ? <CreateTaskForm token={token} /> : <p>Please log in to create tasks.</p>}
        </div>
    );
};

export default AdminDashboard;
