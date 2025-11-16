import mongoose from "mongoose";

const agencySchema = new mongoose.Schema(
  {
    company_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    is_verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Agency = mongoose.model("Agency", agencySchema);
export default Agency;