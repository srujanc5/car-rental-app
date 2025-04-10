"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { format, addDays, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@clerk/nextjs";

export default function CarCard({ car }) {
  const router = useRouter();
  const { isSignedIn } = useUser();

  const isAvailable = car.startDate === null && car.endDate === null;
  const availableDate = car.endDate ? format(addDays(parseISO(car.endDate), 1), "MMM dd, yyyy") : null;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <img
          src={`data:image/jpeg;base64,${car.imageBase64}`}
          alt={`${car.make} ${car.model}`}
          className="w-full h-48 object-cover rounded"
        />
      </CardHeader>
      <CardContent className="flex-1 space-y-2">
        <h2 className="text-lg font-semibold">{car.make} {car.model} ({car.year})</h2>
        <p className="text-sm text-gray-600">Location: {car.location}</p>
        <p className="text-sm text-gray-600">Price: ₹{car.pricePerDay}/day</p>
        {isAvailable ? (
          <Badge className="bg-green-100 text-green-800">Available</Badge>
        ) : (
          <Badge className="bg-orange-100 text-orange-800">
            Available on {availableDate}
          </Badge>
        )}
      </CardContent>
      <CardFooter>
      <Button
        onClick={() =>
            isSignedIn ? router.push(`/car/${car._id}`) : router.push("/sign-in")
        }
        >
        Book Now
    </Button>
      </CardFooter>
    </Card>
  );
}
