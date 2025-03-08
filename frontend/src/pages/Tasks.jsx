import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import CreateTaskForm from "../components/CreateTaskForm";
import { getTasks, updateTask, deleteTask } from "../services/taskService";

const Tasks = ({ token }) => {
    const authToken = token || localStorage.getItem("token");
    console.log("🔑 Token used in Tasks.js:", authToken);

    const [showForm, setShowForm] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [updatedTask, setUpdatedTask] = useState({});

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const tasksData = await getTasks(authToken);
                console.log("📥 API Response:", tasksData);

                if (tasksData.success && Array.isArray(tasksData.tasks)) {
                    setTasks(tasksData.tasks);
                } else {
                    console.error("🚨 Unexpected response:", tasksData);
                    setTasks([]);
                }
            } catch (err) {
                console.error("❌ Error fetching tasks:", err);
                setError("Failed to load tasks. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, [authToken]);

    // ✅ Handle Edit Click
    const handleEditClick = (task) => {
        setEditingTaskId(task._id);
        setUpdatedTask(task);
    };

    // ✅ Handle Save Task
    const handleSaveTask = async (taskId) => {
        try {
            await updateTask(taskId, updatedTask, authToken);
            setTasks(tasks.map(task => (task._id === taskId ? updatedTask : task)));
            setEditingTaskId(null);
        } catch (error) {
            console.error("❌ Error updating task:", error);
        }
    };

    // ❌ Handle Task Deletion
    const handleDeleteTask = async (taskId) => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;
        try {
            await deleteTask(taskId, authToken);
            setTasks(tasks.filter(task => task._id !== taskId));
        } catch (error) {
            console.error("❌ Error deleting task:", error);
        }
    };

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1">
                <Navbar />
                <div className="container mt-4">
                    <h2 className="text-primary">📋 Tasks</h2>
                    <button className="btn btn-success mb-3" onClick={() => setShowForm(!showForm)}>
                        {showForm ? "➖ Hide Create Task Form" : "➕ Create New Task"}
                    </button>

                    {showForm && <CreateTaskForm token={authToken} />}

                    <h3 className="mt-4">Task List</h3>
                    {loading ? (
                        <p>Loading tasks...</p>
                    ) : error ? (
                        <p className="text-danger">{error}</p>
                    ) : tasks.length === 0 ? (
                        <p>No tasks available.</p>
                    ) : (
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Assigned To</th>
                                    <th>Due Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map((task) => (
                                    <tr key={task._id}>
                                        <td>
                                            {editingTaskId === task._id ? (
                                                <input
                                                    type="text"
                                                    value={updatedTask.title}
                                                    onChange={(e) => setUpdatedTask({ ...updatedTask, title: e.target.value })}
                                                />
                                            ) : (
                                                task.title
                                            )}
                                        </td>
                                        <td>
                                            {editingTaskId === task._id ? (
                                                <input
                                                    type="text"
                                                    value={updatedTask.description}
                                                    onChange={(e) => setUpdatedTask({ ...updatedTask, description: e.target.value })}
                                                />
                                            ) : (
                                                task.description
                                            )}
                                        </td>
                                        <td>{task.assignedTo?.name || "Unassigned"}</td>
                                        <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                                        <td>
                                            {editingTaskId === task._id ? (
                                                <select
                                                    value={updatedTask.status}
                                                    onChange={(e) => setUpdatedTask({ ...updatedTask, status: e.target.value })}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="In Progress">In Progress</option>
                                                    <option value="Completed">Completed</option>
                                                </select>
                                            ) : (
                                                task.status
                                            )}
                                        </td>
                                        <td>
                                            {editingTaskId === task._id ? (
                                                <button className="btn btn-primary btn-sm" onClick={() => handleSaveTask(task._id)}>Save</button>
                                            ) : (
                                                <button className="btn btn-warning btn-sm" onClick={() => handleEditClick(task)}>Edit</button>
                                            )}
                                            <button className="btn btn-danger btn-sm ms-2" onClick={() => handleDeleteTask(task._id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Tasks;
