import mongoose from "mongoose";

// Academic Sub-Schema
const academicSchema = new mongoose.Schema({
  department: { type: String, required: true },
  course: { type: String, required: true },
  issueType: { type: String, required: true },
});

// Personal Sub-Schema
const personalSchema = new mongoose.Schema({
  issueType: { type: String, required: true },
});

// Fellow Student Sub-Schema
const fellowStudentSchema = new mongoose.Schema({
  relationship: { type: String, required: true },
  issueType: { type: String, required: true },
});

// Hostel Sub-Schema
const hostelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  room: { type: String, required: true },
  issueType: { type: String, required: true },
  photos: [{ type: String }], // Array of photo URLs
});

// Other Sub-Schema
const otherSchema = new mongoose.Schema({
  details: { type: String, required: true },
  photos: [{ type: String }], // Array of photo URLs
});

const userInfoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fullname: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  studentRef: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  academic: academicSchema,
  personal: personalSchema,
  fellowStudent: fellowStudentSchema,
  hostel: hostelSchema,
  other: otherSchema,
  sentiment: String,
  compoundScore: Number,
  createdAt: { type: Date, default: Date.now },
});

const UserInfo =
  mongoose.models.UserInfo || mongoose.model("UserInfo", userInfoSchema);

export default UserInfo;
