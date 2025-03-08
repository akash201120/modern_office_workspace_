// src/services/taskService.js
export const createTask = async (taskData, token) => {
    console.log("🛠️ API Request - Token being sent:", token);
    try {
        const response = await fetch('http://localhost:5000/api/tasks/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify(taskData)
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to create task');
        }
        return data;
    } catch (error) {
        console.error('Error creating task:', error);
        throw error;
    }
};
export const getTasks = async (token) => {
    console.log("📥 Fetching tasks...");
    try {
        const response = await fetch('http://localhost:5000/api/tasks/', {
            method: 'GET',
            headers: {
                'Authorization': token ? `Bearer ${token}` : '',
            },
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch tasks');
        }
        console.log("✅ Tasks fetched successfully:", data);
        return data; // Return fetched tasks
    } catch (error) {
        console.error('❌ Error fetching tasks:', error);
        throw error;
    }
};

export const updateTask = async (taskId, updatedData, token) => {
    try {

        const { title, description, assignedTo, dueDate, status } = updatedData;

        const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify({title, description, assignedTo, dueDate, status}),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to update task');
        }
        return data;
    } catch (error) {
        console.error('❌ Error updating task:', error);
        throw error;
    }
};

// ❌ Delete Task
export const deleteTask = async (taskId, token) => {
    try {
        const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': token ? `Bearer ${token}` : '',
            },
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to delete task');
        }
        return data;
    } catch (error) {
        console.error('❌ Error deleting task:', error);
        throw error;
    }
};
