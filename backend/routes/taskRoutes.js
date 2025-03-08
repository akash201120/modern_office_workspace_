import express from "express";
import { protect, adminOnly } from "../middleware/authmiddleware.js";
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

const router = express.Router();

/* ==========================
   🔹 ROUTES FOR TASKS
   ========================== */

// 📌 GET all tasks (Admin only)
router.get("/", protect, getTasks);

// 📌 GET a single task by ID (Protected)
router.get("/:id", protect, getTaskById);

// 📌 CREATE a new task (Admin only)
router.post("/", protect,  createTask);

// 📌 UPDATE a task (Admin only)
router.put("/:id", protect,  updateTask);

// 📌 DELETE a task (Admin only)
router.delete("/:id", protect, deleteTask);

export default router;
