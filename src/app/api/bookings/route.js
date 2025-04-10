import { auth } from "@clerk/nextjs/server";
import { currentUser } from '@clerk/nextjs/server'; 
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Booking from "@/models/Booking";
import Car from "@/models/Car";
import User from "@/models/User";

export async function POST(req) {
  await connectDB();
  const { userId} = await auth();

  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { carId, startDate, endDate } = body;

  try {
    // Check for date conflicts
    const conflict = await Booking.findOne({
      carId,
      $or: [
        { startDate: { $lte: new Date(endDate), $gte: new Date(startDate) } },
        { endDate: { $gte: new Date(startDate), $lte: new Date(endDate) } },
      ],
    });

    if (conflict) {
      return NextResponse.json({ error: "Car already booked for this date range" }, { status: 400 });
    }

    const car = await Car.findById(carId);
    if (!car) return NextResponse.json({ error: "Car not found" }, { status: 404 });

    const totalDays = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;
    const totalPrice = totalDays * car.pricePerDay;

    // Find or create user in DB
    let dbUser = await User.findOne({ clerkId: userId });
    if (!dbUser) {
      const user = await currentUser();
      dbUser = await User.create({
        clerkId: userId,
        name: user.firstName + " " + user.lastName,
        email: user.emailAddresses[0].emailAddress,
      });
    }
    const newBooking = await Booking.create({
      userId: dbUser._id,
      carId,
      startDate,
      endDate,
      totalPrice,
      status: "confirmed",
    });

    return NextResponse.json({...newBooking, bookingId: newBooking._id});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Booking failed" }, { status: 500 });
  }
}

export async function GET(req) {
  await connectDB();
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  try {
    const user = await User.findOne({ clerkId: userId });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const total = await Booking.countDocuments({ userId: user._id });
    const bookings = await Booking.find({ userId: user._id })
      .populate("carId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      data: bookings,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}