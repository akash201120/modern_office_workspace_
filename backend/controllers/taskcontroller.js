import Task from "../models/taskmodel.js";

/* ==========================
   🔹 GET ALL TASKS (Admin Only)
   ========================== */
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "name email");
        res.json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/* ==========================
   🔹 GET TASK BY ID
   ========================== */
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/* ==========================
   🔹 CREATE TASK (Admin Only)
   ========================== */
export const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate, status } = req.body;

    if (!title || !description || !dueDate) {
      return res.status(400).json({ success: false, message: "Title, description, and dueDate are required." });
  }

  // Ensure status is valid
  const validStatuses = ["Pending", "In Progress", "Completed"];
  if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value." });
  }

  // Create Task
  const newTask = new Task({
      title,
      description,
      assignedTo: assignedTo || null,
      dueDate,
      createdBy: req.user._id,
      status: status || "Pending",
  });

  await newTask.save();
  res.status(201).json({ success: true, message: "Task created successfully", task: newTask });

} catch (error) {
  console.error("Task Creation Error:", error);
  res.status(500).json({ success: false, message: "Server Error, Could not create task." });
}
};

/* ==========================
   🔹 UPDATE TASK (Admin Only)
   ========================== */
   export const updateTask = async (req, res) => {
    try {
        const { title, description, assignedTo, dueDate, status } = req.body;

        // Check if all required fields exist
        if (!title || !description || !status) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Find and update the task
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { title, description, assignedTo, dueDate, status },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json({ success: true, task: updatedTask });
    } catch (error) {
        console.error("❌ Error updating task:", error);
        res.status(500).json({ message: "Server error" });
    }
};

/* ==========================
   🔹 DELETE TASK (Admin Only)
   ========================== */
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    await task.deleteOne();
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

