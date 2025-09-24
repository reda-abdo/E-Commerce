"use client";

import { useEffect, useState } from "react";
import { Category } from "@/interfaces";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Grid, List, Search } from "lucide-react";
import { CategoriesResponse } from "@/types";
import { apiServices } from "@/services/api";
import { Input } from "@/components/ui/input";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");

  async function fetchCategories() {
    setLoading(true);
    try {
      const data: CategoriesResponse = await apiServices.getAllCategories();
      setCategories(data.data);
      console.log(data.data);
    } catch (e) {
      setError("Failed to load categories");
    }
    setLoading(false);
  }
  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading && categories.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchCategories}>Try Again</Button>
        </div>
      </div>
    );
  }

  const filteredCategories = categories.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold mb-4">Categories </h1>
        <p className="text-muted-foreground">
          Browse products by category to find exactly what you are looking for
        </p>
      </div>

      <div className="flex flex-col gap-4 mb-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
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
        className={`grid gap-6 ${viewMode === "grid"
          ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          : "grid-cols-1 "
          }`}
      >
        {filteredCategories.map((category) => (
          <CategoryCard
            key={category._id}
            category={category}
            viewMode={viewMode}
          />
        ))}
      </div>
    </div>
  );
}
