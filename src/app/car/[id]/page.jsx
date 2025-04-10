"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { differenceInCalendarDays, isBefore } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import CarCard from "@/components/CarCard";
import BookingSuccessModal from "@/components/BookingSuccesModel";

export default function CarBookingPage() {
  const { id } = useParams();
  const { user } = useUser();
  const router = useRouter();

  const [car, setCar] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState("");

  const [similarCars, setSimilarCars] = useState([]);
  const [similarPage, setSimilarPage] = useState(1);
  const [totalSimilarPages, setTotalSimilarPages] = useState(1);

  const [showSuccess, setShowSuccess] = useState(false); // ✅ modal control
  const [bookingId, setBookingId] = useState(null); // ✅ store booking ID

  useEffect(() => {
    async function fetchCar() {
      const res = await fetch(`/api/cars/${id}`);
      const json = await res.json();
      setCar(json);
    }
    fetchCar();
  }, [id]);

  useEffect(() => {
    if (startDate && endDate && car) {
      const days = differenceInCalendarDays(new Date(endDate), new Date(startDate)) + 1;
      if (days > 0 && days <= 7) {
        setTotalPrice(days * car.pricePerDay);
        setError("");
      } else if (days > 7) {
        setError("Booking can't exceed 7 days. Rebook from the extended date.");
        setTotalPrice(0);
      } else {
        setTotalPrice(0);
      }
    }
  }, [startDate, endDate, car]);

  useEffect(() => {
    if (car) {
      async function fetchSimilarCars() {
        const res = await fetch(
          `/api/cars?make=${car.make}&model=${car.model}&page=${similarPage}&limit=4`
        );
        const json = await res.json();
        setSimilarCars(json.data.filter((c) => c._id !== id));
        setTotalSimilarPages(json.pagination.totalPages);
      }
      fetchSimilarCars();
    }
  }, [car, similarPage, id]);

  async function handleBooking() {
    if (!user) return;
    setError("");

    if (isBefore(new Date(startDate), new Date())) {
      setError("Start date can't be in the past.");
      return;
    }

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carId: id,
          userId: user.id,
          startDate,
          endDate,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // ✅ Show modal with bookingId
      setBookingId(data.bookingId); // Make sure your API returns this
      setShowSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  }

  if (!car) return <div className="p-6">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <img
            src={`data:image/jpeg;base64,${car.imageBase64}`}
            alt="Car"
            className="rounded-lg w-full h-auto"
          />
        </div>

        <div>
          <h1 className="text-2xl font-bold mb-2">
            {car.make} {car.model} ({car.year})
          </h1>
          <p className="text-sm text-gray-600 mb-2">Registration No: {car.registrationNumber}</p>
          <p className="text-sm text-gray-600 mb-2">Location: {car.location}</p>
          <p className="text-sm text-gray-600 mb-4">Price per day: ₹{car.pricePerDay}</p>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            {totalPrice > 0 && (
              <p className="text-green-600 font-semibold">Total: ₹{totalPrice}</p>
            )}
            {error && (
              <div className="text-red-600 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
            <Button onClick={handleBooking} className="w-full mt-2">
              Confirm Booking
            </Button>
          </div>
        </div>
      </div>

      {/* Similar Cars Section */}
      <div className="hidden lg:block max-w-6xl mx-auto px-6 mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Similar Cars</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setSimilarPage((p) => Math.max(p - 1, 1))}
              disabled={similarPage === 1}
              className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setSimilarPage((p) => Math.min(p + 1, totalSimilarPages))}
              disabled={similarPage === totalSimilarPages}
              className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {similarCars.map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      </div>

      {/* ✅ Booking Success Modal */}
      <BookingSuccessModal
        show={showSuccess}
        onClose={() => setShowSuccess(false)}
        bookingId={bookingId}
        userName={user?.firstName || "User"}
      />
    </div>
  );
}
