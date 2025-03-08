import React, { useEffect, useState } from "react";
import { getTasks } from "../services/taskService"; // Import API function

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Get token from localStorage
    const authToken = localStorage.getItem("token");

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await getTasks(authToken);
                setTasks(response.tasks || []); // Ensure tasks array exists
            } catch (err) {
                setError("❌ Failed to fetch tasks");
                console.error("Error fetching tasks:", err);
            }
            setLoading(false);
        };

        fetchTasks();
    }, []);

    if (loading) return <p>Loading tasks...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h3>Task List</h3>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Assigned To</th>
                        <th>Due Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="text-center">No tasks available.</td>
                        </tr>
                    ) : (
                        tasks.map((task) => (
                            <tr key={task._id}>
                                <td>{task.title}</td>
                                <td>{task.description}</td>
                                <td>{task.assignedTo || "Not Assigned"}</td>
                                <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                                <td>{task.status}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TaskList;
