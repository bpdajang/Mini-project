import mongoose from "mongoose";

const adminAnswerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    infoReportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserInfo",
      required: true,
    },
    answerText: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const AdminAnswer = mongoose.model("AdminAnswer", adminAnswerSchema);

export default AdminAnswer;
