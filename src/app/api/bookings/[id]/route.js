import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Booking from "@/models/Booking";
import User from "@/models/User";
import Car from "@/models/Car";

export async function PATCH(req, { params }) {
  await connectDB();
  const { userId } = await auth();
  const bookingId = params.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const dbUser = await User.findOne({ clerkId: userId });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.userId.toString() !== dbUser._id.toString()) {
      return NextResponse.json({ error: "Not allowed to cancel this booking" }, { status: 403 });
    }

    const now = new Date();
    if (now >= booking.startDate && now <= booking.endDate) {
      return NextResponse.json({
        error: "Cannot cancel booking during active rental period",
      }, { status: 400 });
    }
    if (booking.status === "cancelled") {
      return NextResponse.json({ message: "Booking already cancelled" });
    }
    if (booking.status === "completed") {
        return NextResponse.json({ message: "Booking is completed" });
    }
    booking.status = "cancelled";
    await booking.save();

    // Make the car available again
    await Car.findByIdAndUpdate(booking.carId, { isAvailable: true });

    return NextResponse.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Cancel booking error:", error);
    return NextResponse.json({ error: "Failed to cancel booking" }, { status: 500 });
  }
}