"use client";

import { useState } from "react";
import { format, isBefore, isWithinInterval, differenceInCalendarDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import DialogCard from "./DialogCard";

export default function BookingCard({ booking }) {
  const router = useRouter();
  const [isCancelling, setIsCancelling] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [error, setError] = useState("");

  const {
    _id,
    startDate,
    endDate,
    createdAt,
    carId: car,
  } = booking;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();

  const days = differenceInCalendarDays(end, start) + 1;

  if (!car) {
    return (
      <div className="flex flex-col gap-2 rounded-xl shadow-md border p-4">
        <h2 className="text-lg font-semibold text-red-600">
          Car data not available
        </h2>
        <p className="text-sm text-muted-foreground">
          This booking seems to be linked to a deleted or unavailable car.
        </p>
      </div>
    );
  }
  
  const total = days * car.pricePerDay;

  let status = "Upcoming";
  if (booking.status === "cancelled") status = "Cancelled";
  else if (isBefore(end, today)) status = "Completed";
  else if (isWithinInterval(today, { start, end })) status = "Active";

  const handleCancel = async () => {
    setError("");
    setIsCancelling(true);
    try {
      const res = await fetch(`/api/bookings/${_id}`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setShowConfirmDialog(false);
      setShowSuccessDialog(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <>
      {/* Booking Card */}
      <div className="flex flex-col md:flex-row gap-4 rounded-xl shadow-md border p-4">
        <img
          src={`data:image/jpeg;base64,${car.imageBase64}`}
          alt={car.make}
          className="w-full md:w-60 h-40 object-cover rounded-md"
        />

        <div className="flex-1 space-y-2">
          <h2 className="text-lg font-semibold">
            {car.make} {car.model} ({car.year})
          </h2>
          <p className="text-sm text-muted-foreground">
            Reg: {car.registrationNumber} | Location: {car.location}
          </p>

          <p className="text-sm">
            <span className="font-medium">Dates:</span>{" "}
            {format(start, "MMM d, yyyy")} – {format(end, "MMM d, yyyy")} ({days} days)
          </p>

          <p className="text-sm">
            <span className="font-medium">Total Price:</span> ₹{total}
          </p>

          <p className="text-xs text-gray-500">
            Booked on {format(new Date(createdAt), "MMM d, yyyy")}
          </p>

          <div className="flex items-center justify-between pt-2">
            <span
              className={`text-sm font-medium px-3 py-1 rounded-full 
                ${
                    status === "Upcoming"
                      ? "bg-yellow-100 text-yellow-800"
                      : status === "Active"
                      ? "bg-green-100 text-green-800"
                      : status === "Completed"
                      ? "bg-gray-100 text-gray-700"
                      : "bg-red-100 text-red-800" 
                }`}
            >
              {status}
            </span>

            <Button
              variant="destructive"
              size="sm"
              disabled={isCancelling || status !== "Upcoming"}
              onClick={() => setShowConfirmDialog(true)}
            >
              Cancel Booking
            </Button>
          </div>

          {error && (
            <div className="text-red-600 text-sm flex items-center gap-2 mt-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Confirm Cancel Dialog */}
      {showConfirmDialog && (
        <DialogCard
          title="Are you sure you want to cancel this booking?"
          description="You won't be able to use the car during the reserved dates if you cancel this booking."
          confirmLabel={isCancelling ? "Cancelling..." : "Yes, Cancel Booking"}
          cancelLabel="Go Back"
          onConfirm={handleCancel}
          onCancel={() => setShowConfirmDialog(false)}
          isLoading={isCancelling}
        />
      )}

      {/* Success Dialog */}
      {showSuccessDialog && (
        <DialogCard
          title="Booking Cancelled"
          description="Your booking was successfully cancelled. What would you like to do next?"
          confirmLabel="Explore Cars"
          cancelLabel="Stay on My Bookings"
          onConfirm={() => router.push("/")}
          onCancel={() => {
            setShowSuccessDialog(false);
            router.refresh();
          }}
        />
      )}
    </>
  );
}
