import express from "express";
import AdminAnswer from "../models/AdminAnswer.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Create a new admin answer (admin only)
router.post("/create", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { userId, infoReportId, answerText } = req.body;

    // Add validation for userId
    if (!userId || !infoReportId || !answerText) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newAnswer = new AdminAnswer({
      userId, // This should be the ID of the user who submitted the report
      infoReportId,
      answerText,
    });

    await newAnswer.save();
    res.status(201).json(newAnswer);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

// Get answers for a specific user
router.get("/user/:id", auth, async (req, res) => {
  console.log("GET /user/:id called with id:", req.params.id);
  try {
    const answers = await AdminAnswer.find({ userId: req.params.id })
      .populate("infoReportId", "description createdAt") // Populate report details
      .sort({ createdAt: -1 });

    res.status(200).json(answers);
  } catch (error) {
    console.error("Error in GET /user/:id:", error);
    res.status(500).json({ message: error.message });
  }
});

// Update the "me" route to properly populate report data
router.get("/me", auth, async (req, res) => {
  try {
    const answers = await AdminAnswer.find({ userId: req.user.id })
      .populate({
        path: "infoReportId",
        select: "description createdAt", // Add any other fields you need
      })
      .sort({ createdAt: -1 });

    res.status(200).json(answers);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

router.get("/all", auth, async (req, res) => {
  try {
    // Only allow admins to access all answers
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const answers = await AdminAnswer.find()
      .populate("infoReportId", "description") // Populate report description
      .sort({ createdAt: -1 });

    res.status(200).json(answers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
