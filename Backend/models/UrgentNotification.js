import mongoose from "mongoose";

const urgentNotificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  type: { type: String, enum: ["anonymous", "info"], required: true },
  reportId: { type: mongoose.Schema.Types.ObjectId, required: true },
  sentimentScore: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const UrgentNotification = mongoose.model(
  "UrgentNotification",
  urgentNotificationSchema
);

export default UrgentNotification;
