
"use client";
import { Button, LoadingSpinner, ProductCard } from "@/components";
import { Category, Product } from "@/interfaces";
import { apiServices } from "@/services/api";
import { ProductsResponse, SingleCategoryResponse } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";

export default function CategoryPage() {
  const { id } = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);

  const fetchCategoryDetails = useCallback(async () => {
    try {
      setLoading(true);
      const data: SingleCategoryResponse =
        await apiServices.getCategoriesDitails(String(id));
      setCategory(data.data);
    } catch {
      setError("Failed to load category");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCategoryDetails();
  }, [fetchCategoryDetails]);

  useEffect(() => {
    async function fetchProducts() {
      if (!category) return;
      const all: ProductsResponse = await apiServices.getAllProduct();
      const filtered = all.data.filter(
        (p) => p.category && p.category._id === category._id
      );
      setCategoryProducts(filtered);
    }
    fetchProducts();
  }, [category]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button asChild>
            <Link href="/categories">Back to Categories</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
        <div className="relative w-32 h-32 flex-shrink-0">
          <Image
            src={category?.image ?? "/vercel.svg"}
            alt={category?.name || ""}
            fill
            className="object-contain rounded-md"
            sizes="128px"
          />
        </div>
        <div className="flex-1 min-w-0 mt-5">
          <h1 className="font-extrabold text-3xl">{category?.name}</h1>
          <p className="text-sm text-muted-foreground">
            Explore amazing {category?.name.toLowerCase()} products
          </p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Products</h2>
        {categoryProducts.length === 0 ? (
          <p className="text-center text-gray-500">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categoryProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
