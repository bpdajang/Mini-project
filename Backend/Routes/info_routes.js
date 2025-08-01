import UserInfo from "../models/info_model.js";
import express from "express";
import { analyzeSentiment } from "../utils/sentimentAnalyzer.js";
import UrgentNotification from "../models/UrgentNotification.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", auth, async (req, res) => {
  try {
    const sentiment = analyzeSentiment(req.body.description);

    const newUserInfo = await UserInfo.create({
      userId: req.user.id,
      fullname: req.body.fullname,
      email: req.body.email,
      phone: req.body.phone,
      studentRef: req.body.studentRef,
      category: req.body.category,
      description: req.body.description,
      sentiment: sentiment.sentiment,
      compoundScore: sentiment.compoundScore, // Fixed property name
    });

    if (sentiment.compoundScore <= -0.7) {
      await UrgentNotification.create({
        message: `URGENT: Negative report from ${req.body.fullname}`,
        type: "info",
        reportId: newUserInfo._id,
        sentimentScore: sentiment.compoundScore,
      });
    }

    res.status(201).json(newUserInfo);
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.error(`Error creating user info: ${error.message}`);
  }
});

router.put("/update/:id", auth, async (req, res) => {
  try {
    const updatedUserInfo = await UserInfo.findByIdAndUpdate(
      req.params.id,
      {
        fullname: req.body.fullname,
        email: req.body.email,
        phone: req.body.phone,
        studentRef: req.body.studentRef, // Fixed field name
        category: req.body.category, // Added missing fields
        description: req.body.description,
      },
      { new: true, runValidators: true }
    );
    if (!updatedUserInfo) {
      return res.status(404).json({ message: "User info not found" });
    }
    res.status(200).json(updatedUserInfo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/all", async (req, res) => {
  try {
    const userInfo = await UserInfo.find().sort({ createdAt: -1 });
    res.status(200).json(userInfo);
  } catch (error) {
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
