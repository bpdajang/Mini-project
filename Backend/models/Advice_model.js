import mongoose from "mongoose";

const adviceArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  excerpt: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: Date, default: Date.now },
  readTime: { type: String, required: true },
  image: { type: String, required: true },
  link: { type: String, required: true }, // Added required link field
});

export default mongoose.model("AdviceArticle", adviceArticleSchema);
