import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  carId: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ["confirmed", "cancelled", "completed"],
    default: "confirmed",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Booking || mongoose.model("Booking", bookingSchema);