"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";
import CarCard from "@/components/CarCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const MAKES = ["All", "Maruti", "Hyundai", "Mahindra"];
const MODELS = {
  Maruti: ["All", "Alto", "Swift", "Dzire", "Baleno", "Brezza"],
  Hyundai: ["All", "i10", "i20"],
  Mahindra: ["All", "Thar"],
};
const LOCATIONS = ["Guntur", "Vijayawada"];

export default function HomePage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("");

  useEffect(() => {
    async function fetchCars() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page,
          limit: 6,
          ...(make && { make }),
          ...(model && { model }),
          ...(location && { location }),
          ...(sort && { sort }),
        });

        const res = await fetch(`/api/cars?${params.toString()}`);
        const json = await res.json();
        setCars(json.data);
        setTotalPages(json.pagination.totalPages);
      } catch (error) {
        console.error("Failed to fetch cars:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCars();
  }, [page, make, model, location, sort]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [make, model, location, sort]);

  const handleMakeChange = (value) => {
    if (value !== "All"){
    setMake(value);
    } else {
      setMake("")
    }
    setModel(""); // reset model when make changes
  };

  const handleModelChange = (value) => {
    value === "All" ? setModel("") : setModel(value)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Hop In – Let’s Go!</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Make */}
        <Select value={make} onValueChange={handleMakeChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Make" />
          </SelectTrigger>
          <SelectContent>
            {MAKES.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Model */}
        <Select
          value={model}
          onValueChange={handleModelChange}
          disabled={!make}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={make ? "Select Model" : "Select Make first"} />
          </SelectTrigger>
          <SelectContent>
            {(MODELS[make] || []).map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Location */}
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Location" />
          </SelectTrigger>
          <SelectContent>
            {LOCATIONS.map((loc) => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price_asc">Price (Low → High)</SelectItem>
            <SelectItem value="price_desc">Price (High → Low)</SelectItem>
            <SelectItem value="year_asc">Year (Old → New)</SelectItem>
            <SelectItem value="year_desc">Year (New → Old)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cars Grid */}
      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center gap-2 pt-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setPage(1)}
          disabled={page === 1}
        >
          <ChevronsLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <span className="flex items-center px-3 text-sm">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setPage(totalPages)}
          disabled={page === totalPages}
        >
          <ChevronsRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
