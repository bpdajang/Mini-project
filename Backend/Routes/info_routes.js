import UserInfo from "../models/info_model.js";
import User from "../models/User.js";
import express from "express";
import user from "../models/User.js";
import { analyzeSentiment } from "../utils/sentimentAnalyzer.js";
import UrgentNotification from "../models/UrgentNotification.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", auth, async (req, res) => {
  try {
    // Get user from DB
    const user = await User.findById(req.body.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const sentiment = analyzeSentiment(req.body.description);

    const newConcern = await UserInfo.create({
      userId: user._id,
      fullname: user.name,
      phone: req.body.phone,
      studentRef: user.studentRef,
      category: req.body.category,
      description: req.body.description,
      sentiment: sentiment.sentiment,
      compoundScore: sentiment.compoundScore,
    });

    if (sentiment.compoundScore <= -0.7) {
      await UrgentNotification.create({
        message: `URGENT: Negative report from ${req.body.fullname}`,
        type: "info",
        reportId: newConcern._id,
        UserMessage: newConcern.description,
        sentimentScore: sentiment.compoundScore,
      });
    }

    res.status(201).json(newConcern);
  } catch (error) {
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        message: `${field} already exists`,
        code: "DUPLICATE_FIELD",
        field: field,
      });
    }

    res.status(400).json({ message: error.message });
    console.error(`Error creating user info: ${error.message}`);
  }
});

router.get("/all", async (req, res) => {
  try {
    const userInfo = await UserInfo.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email");
    res.status(200).json(userInfo);
  } catch (error) {
    console.error("Error in GET /all:", error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/userinfo/:id", async (req, res) => {
  try {
    const userInfo = await UserInfo.findById(req.params.id);
    if (!userInfo) {
      return res.status(404).json({ message: "User info not found" });
    }
    res.status(200).json(userInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// New route to get info reports by userId
router.get("/user/:userId", auth, async (req, res) => {
  try {
    const userInfo = await UserInfo.find({ userId: req.params.userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(userInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedUserInfo = await UserInfo.findByIdAndDelete(req.params.id);
    if (!deletedUserInfo) {
      return res.status(404).json({ message: "User info not found" });
    }
    res.status(200).json({ message: "User info deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
