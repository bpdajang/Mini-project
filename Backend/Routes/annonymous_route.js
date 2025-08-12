import AnonymousMessage from "../models/annonymous_model.js";
import express from "express";
import { analyzeSentiment } from "../utils/sentimentAnalyzer.js";
import UrgentNotification from "../models/UrgentNotification.js";

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const sentiment = analyzeSentiment(req.body.message);

    const newMessage = await AnonymousMessage.create({
      message: req.body.message,
      sentiment: sentiment.sentiment,
      compoundScore: sentiment.compoundScore,
    });

    if (sentiment.compoundScore <= -0.5) {
      await UrgentNotification.create({
        message: `URGENT: Negative anonymous message detected`,
        type: "anonymous",
        reportId: newMessage._id,
        sentimentScore: sentiment.compoundScore,
      });
    }

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/all", async (req, res) => {
  try {
    const messages = await AnonymousMessage.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/getone/:id", async (req, res) => {
  try {
    const message = await AnonymousMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedMessage = await AnonymousMessage.findByIdAndDelete(
      req.params.id
    );
    if (!deletedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
