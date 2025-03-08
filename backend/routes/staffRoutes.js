import express from "express";
import Staff from "../models/staffModel.js"; // Assuming you have a Staff model

const router = express.Router();

// Get all staff members
router.get("/", async (req, res) => {
  try {
    const staffList = await Staff.find();
    res.status(200).json(staffList);
  } catch (error) {
    res.status(500).json({ message: "Error fetching staff data" });
  }
});

export default router;
