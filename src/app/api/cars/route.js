import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Car from "@/models/Car";
import Booking from "@/models/Booking";

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  // Filters
  const make = searchParams.get("make");
  const model = searchParams.get("model");
  const location = searchParams.get("location");

  // Sorting
  const sortParam = searchParams.get("sort"); // e.g., "year_desc", "price_asc"
  let sortBy = null;
  let sortOrder = 1; // default to ascending

  if (sortParam) {
    const [field, order] = sortParam.split("_");
    sortBy = field;
    sortOrder = order === "desc" ? -1 : 1;
  }

  const query = {};
  if (make) query.make = make;
  if (model) query.model = model;
  if (location) query.location = location;

  const sortOptions = {};
  if (sortBy === "price") sortOptions.pricePerDay = sortOrder;
  if (sortBy === "year") sortOptions.year = sortOrder;

  try {
    const total = await Car.countDocuments(query);
    const cars = await Car.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const carIds = cars.map(car => car._id);

    // Get active bookings for listed cars
    const bookings = await Booking.find({
      carId: { $in: carIds },
      status: "confirmed"
    });

    // Map carId to booking
    const bookingMap = {};
    bookings.forEach(b => {
      bookingMap[b.carId.toString()] = {
        startDate: b.startDate,
        endDate: b.endDate
      };
    });

    // Add booking info to each car
    const carsWithDates = cars.map(car => {
      const booking = bookingMap[car._id.toString()];
      return {
        ...car.toObject(),
        startDate: booking?.startDate || null,
        endDate: booking?.endDate || null
      };
    });

    return NextResponse.json({
      data: carsWithDates,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch cars" }, { status: 500 });
  }
}

export async function POST(req) {
    await connectDB();
    console.log("db connected")
    try {
      const body = await req.json();
  
      const requiredFields = [
        "make", "model", "year", "registrationNumber",
        "pricePerDay", "imageBase64", "location"
      ];
  
      const missing = requiredFields.filter((f) => !body[f]);
      if (missing.length > 0) {
        return NextResponse.json(
          { error: `Missing fields: ${missing.join(", ")}` },
          { status: 400 }
        );
      }
  
      const newCar = await Car.create({
        make: body.make,
        model: body.model,
        year: body.year,
        registrationNumber: body.registrationNumber,
        pricePerDay: body.pricePerDay,
        imageBase64: body.imageBase64,
        location: body.location,
        isAvailable: true,
      });
  
      return NextResponse.json(newCar, { status: 201 });
    } catch (error) {
      console.error("POST /api/cars error:", error);
      return NextResponse.json({ error: "Failed to create car" }, { status: 500 });
    }
  }