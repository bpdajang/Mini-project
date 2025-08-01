import express from "express";
import UrgentNotification from "../models/UrgentNotification.js";

const router = express.Router();

// Get urgent notifications
router.get("/urgent", async (req, res) => {
  try {
    const notifications = await UrgentNotification.find()
      .sort({ createdAt: -1 })
      .limit(10);

    // Removed io.emit since io is not defined here
    // io.emit("urgent-notification", notification);
    res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Mark notification as resolved
router.delete("/urgent/:id", async (req, res) => {
  try {
    await UrgentNotification.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Notification resolved" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
