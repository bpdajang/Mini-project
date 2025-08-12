import express from "express";
import AdviceArticle from "../models/Advice_model.js";
import { auth, admin } from "../middleware/auth.js";

const router = express.Router();

// Get all articles
router.get("/", async (req, res) => {
  try {
    const articles = await AdviceArticle.find().sort({ date: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new article (Admin only)
router.post("/create", auth, admin, async (req, res) => {
  const article = new AdviceArticle({
    title: req.body.title,
    category: req.body.category,
    excerpt: req.body.excerpt,
    author: req.body.author,
    readTime: req.body.readTime,
    image: req.body.image,
    link: req.body.link,
  });

  try {
    const newArticle = await article.save();
    res.status(201).json(newArticle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update article (Admin only)
router.patch("/update/:id", auth, admin, async (req, res) => {
  try {
    const updatedArticle = await AdviceArticle.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedArticle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete article (Admin only)
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    await AdviceArticle.findByIdAndDelete(req.params.id);
    res.json({ message: "Article deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
