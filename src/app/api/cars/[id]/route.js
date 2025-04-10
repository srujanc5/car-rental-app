import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Car from "@/models/Car";

export async function GET(req, { params }) {
  await connectDB();

  try {
    const car = await Car.findById(params.id);
    if (!car) return NextResponse.json({ error: "Car not found" }, { status: 404 });

    return NextResponse.json(car);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching car" }, { status: 500 });
  }
}