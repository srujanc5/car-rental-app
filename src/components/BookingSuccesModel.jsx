import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function BookingSuccessModal({ show, onClose, bookingId, userName }) {
  const router = useRouter();

  if (!show) return null;

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="text-center space-y-4">
        <h2 className="text-xl font-semibold">
          🎉 Booking Confirmed, {userName}!
        </h2>
        <p className="text-muted-foreground">
          Your car is ready to go. What would you like to do next?
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <Button onClick={() => router.push(`/bookings`)}>
            View Booking Details
          </Button>
          <Button variant="outline" onClick={() => router.push("/")}>
            Find Another Ride
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}