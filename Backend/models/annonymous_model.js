import mongoose from "mongoose";

const anonymousMessageSchema = new mongoose.Schema({
  message: { type: String, required: true },
  sentiment: String,
  compoundScore: Number,
  createdAt: { type: Date, default: Date.now },
});

const AnonymousMessage = mongoose.model(
  "AnonymousMessage",
  anonymousMessageSchema
);

export default AnonymousMessage;
