"use client";

import Image from "next/image";
import Link from "next/link";
import { Brand } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

interface BrandCardProps {
  brand: Brand;
  viewMode?: "grid" | "list";
}

export function BrandCard({ brand, viewMode = "grid" }: BrandCardProps) {
  if (viewMode === "list") {
    return (
      <div className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
        <div className="relative w-32 h-32 flex-shrink-0">
          <Image
            src={brand.image}
            alt={brand.name}
            fill
            className="object-contain  rounded-md "
            sizes="128px"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg line-clamp-2">{brand.name}</h3>
            {/* <Button variant="ghost" size="sm">
              <Heart className="h-4 w-4" />
            </Button> */}
          </div>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            Discover products from {brand.name}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>View products</span>
            </div>

            <Link href={`/products?brand=${brand.slug}`}>
              <Button>View Products</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex flex-col justify-between relative bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="">
        <div className="relative aspect-square overflow-hidden flex items-center justify-center ">
          <Image
            src={brand.image}
            alt={brand.name}
            fill
            className="object-contain rounded-md  group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />


          {/* <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
          >
            <Heart className="h-4 w-4" />
          </Button> */}
        </div>

        <div className="px-4 pt-4">

          <h3 className="font-semibold text-sm mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            <Link
              href={"/brands/" + brand._id}>
              {brand.name}
            </Link>
          </h3>

          <p className="text-xs text-muted-foreground mb-2">
            Discover products from {brand.name}
          </p>
        </div>
      </div>

      <div className="p-4">
        <Link href={`/brands/${brand._id}`}>
          <Button className="w-full">
            <Package className="h-4 w-4 mr-2" />
            View Products
          </Button>
        </Link>
      </div>
    </div>
  );
}


