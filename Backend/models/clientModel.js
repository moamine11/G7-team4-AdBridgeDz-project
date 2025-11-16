import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    full_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    is_verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Client = mongoose.model("Client", clientSchema);
export default Client;