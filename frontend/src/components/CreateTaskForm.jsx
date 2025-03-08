import React, { useState } from "react";
import { createTask } from "../services/taskService";

const CreateTaskForm = ({ token }) => {
    // Get the token: Use the passed token first, else fallback to localStorage
    const authToken = token || localStorage.getItem("token");

    console.log("🔑 Token received in CreateTaskForm:", authToken);

    // Initial State for Task Form
    const [task, setTask] = useState({
        title: "",
        description: "",
        assignedTo: "",
        dueDate: "",
        status: "Pending",
    });

    const [message, setMessage] = useState(""); // Success/Error Message
    const [loading, setLoading] = useState(false); // Loading State

    // Handle input changes
    const handleChange = (e) => {
        setTask({ ...task, [e.target.name]: e.target.value });
    };

    // Form Validation
    const validateForm = () => {
        if (!task.title || !task.description || !task.dueDate) {
            setMessage("❌ Please fill in all required fields.");
            return false;
        }
        return true;
    };

    // Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(""); // Clear previous messages

        if (!authToken) {
            console.error("🚨 No token provided! User might not be logged in.");
            setMessage("❌ Authentication error: No token provided.");
            return;
        }

        if (!validateForm()) return; // Stop if validation fails

        setLoading(true); // Show loading state
        try {
            console.log("📤 Submitting task:", task);
            console.log("🔑 Using token:", authToken);

            // Pass the correct token to createTask function
            const response = await createTask(task, authToken);
            setMessage(`✅ ${response.message || "Task Created Successfully!"}`);

            // Reset form after successful submission
            setTask({ title: "", description: "", assignedTo: "", dueDate: "", status: "Pending" });
        } catch (error) {
            console.error("❌ Error creating task:", error);
            setMessage(error.message || "❌ Error creating task");
        }
        setLoading(false); // Hide loading state
    };

    return (
        <div className="container mt-4">
            <h3>Create Task</h3>

            {/* Display Success/Error Message */}
            {message && <div className={`alert ${message.includes("❌") ? "alert-danger" : "alert-success"}`}>{message}</div>}

            <form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm">
                <div className="mb-3">
                    <label className="form-label">Title <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" name="title" value={task.title} onChange={handleChange} required />
                </div>

                <div className="mb-3">
                    <label className="form-label">Description <span className="text-danger">*</span></label>
                    <textarea className="form-control" name="description" value={task.description} onChange={handleChange} required />
                </div>

                <div className="mb-3">
                    <label className="form-label">Assign To (User ID)</label>
                    <input type="text" className="form-control" name="assignedTo" value={task.assignedTo} onChange={handleChange} />
                </div>

                <div className="mb-3">
                    <label className="form-label">Due Date <span className="text-danger">*</span></label>
                    <input type="date" className="form-control" name="dueDate" value={task.dueDate} onChange={handleChange} required />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Creating Task..." : "Create Task"}
                </button>
            </form>
        </div>
    );
};

export default CreateTaskForm;

