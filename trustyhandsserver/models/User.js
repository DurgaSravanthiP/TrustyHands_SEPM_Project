import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ["customer", "worker", "admin"] },
    phone: { type: String, required: true },
    address: {
      line: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    workerDetails: {
      skill: { type: String },
      experience: { type: String },
      serviceArea: { type: String },
      idProof: { type: String },
      profilePhoto: { type: String },
      status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    },
    isSuspended: { type: Boolean, default: false },
    suspensionReason: { type: String },
    status: { type: String, enum: ["pending", "approved", "rejected"] },
  },

  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);