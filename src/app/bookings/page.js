"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import BookingCard from "@/components/BookingCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function MyBookingsPage() {
  const { user } = useUser();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!user) return;

    async function fetchBookings() {
      setLoading(true);
      try {
        const res = await fetch(`/api/bookings?page=${page}&limit=4`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Something went wrong");
        setBookings(data.data);
        setTotalPages(data.pagination.totalPages);
        setError("");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [user, page]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">My Bookings</h1>

      {loading && <p>Loading your bookings...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && bookings.length === 0 && (
        <p className="text-gray-600">No bookings found. Start by renting your first car!</p>
      )}

      <div className="space-y-6">
        {bookings.map((booking) => (
          <BookingCard key={booking._id} booking={booking} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-sm font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}