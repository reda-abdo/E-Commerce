"use client";

import {  useEffect, useState } from "react";
import { Brand } from "@/interfaces";
import { BrandCard } from "@/components/brands/BrandCard";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Grid, List, Search } from "lucide-react";
import { BrandsResponse } from "@/types";
import { apiServices } from "@/services/api";   
import { Input } from "@/components/ui/input";

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");

  async function fetchBrands() {
    setLoading(true);
    try {
      const data: BrandsResponse = await apiServices.getAllBrands();
      setBrands(data.data);
      console.log(data.data)
    } catch (e) {
      setError("Failed to load brands");
      }
  setLoading(false);
  }
  useEffect(() => {
    fetchBrands();
  }, []);

  if (loading && brands.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchBrands}>Try Again</Button>
        </div>
      </div>
    );
  }

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Brands</h1>
        <p className="text-muted-foreground">
          Discover products from your favorite brands
        </p>
      </div>

      <div className="flex flex-col gap-4 mb-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /> 
          <Input 
            placeholder="Search brands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-white border-input h-10 rounded-md "
          />
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div
        className={`grid gap-6 ${
          viewMode === "grid"
            ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            : "grid-cols-1 "
        }`}
      >
        {filteredBrands.map((brand) => (
          <BrandCard key={brand._id} brand={brand} viewMode={viewMode} />
        ))}
      </div>
    </div>
  );
}


