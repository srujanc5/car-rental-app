import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  registrationNumber: { type: String, required: true, unique: true },
  pricePerDay: { type: Number, required: true },
  imageBase64: { type: String, required: true },
  location: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Car || mongoose.model("Car", carSchema);