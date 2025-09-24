"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { renderStars } from "@/helpers/rating";
import { formatPrice } from "@/helpers/currency";
import AddProdcutCartButton from "./AddTocartButton";
import { apiServices } from "@/services/api";

import { useContext, useEffect, useState } from "react";
import { CartContext } from "@/contexts/cartContext";
import { useWishHeart } from "@/contexts/whishHartContext";
import { useSession } from "next-auth/react";

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
}
interface ppp {
  _id: string
}

export function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const [addCartLoading, setAddCartLoading] = useState(false);
  const { handelAddToCart } = useContext(CartContext);
  const { isWishlisted, toggleWishlist } = useWishHeart();
  const { data: session } = useSession();



  useEffect(() => {
    async function checkIfWishlisted() {
      try {
        const res = await apiServices.getWishlist(session?.accessToken || "");
        const wishlistProducts = res.data; // افترض إن الـ API بيرجع array من المنتجات
        toggleWishlist(wishlistProducts.some((p: ppp) => p._id === product._id));
      } catch (error) {
        console.error(error);
      }
    }
    checkIfWishlisted();
  }, [product._id]);

  if (viewMode === "list") {
    return (
      <div className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
        <div className="relative w-32 h-32 flex-shrink-0">
          <Image
            src={product.imageCover}
            alt={""}
            fill
            className="object-cover rounded-md"
            sizes="128px"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg line-clamp-2">
              <Link
                href={`/products/${product.id}`}
                className="hover:text-primary transition-colors"
              >
                {product.title}
              </Link>
            </h3>

            {/* <Button variant="ghost" size="sm">
              <Heart className="h-4 w-4" />
            </Button> */}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleWishlist(product._id)}
              className="absolute top-2 right-2 bg-white/80 hover:bg-white"
            >
              <Heart
                className={`h-5 w-5 ${isWishlisted(product._id) ? "text-red-500 fill-red-500" : "text-gray-500"
                  }`}
              />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1">
              {renderStars(product.ratingsAverage)}
              <span className="text-sm text-muted-foreground ml-1">
                ({product.ratingsQuantity})
              </span>
            </div>

            <span className="text-sm text-muted-foreground">
              {product.sold} sold
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>
                  Brand:{" "}
                  <Link
                    href={`/brands/${product.brand._id}`}
                    className="hover:text-primary hover:underline transition-colors"
                  >
                    {product.brand.name}
                  </Link>
                </span>
                <span>
                  Category:{" "}
                  <Link
                    href={`/categories/${product.category._id}`}
                    className="hover:text-primary hover:underline transition-colors"
                  >
                    {product.category.name}
                  </Link>
                </span>
              </div>
            </div>

            {/* <Button>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button> */}
            <div className="w-50">
              <AddProdcutCartButton
                addCartLoading={addCartLoading}
                handelAddToCart={() =>
                  handelAddToCart!(product._id, setAddCartLoading)
                }
                productQuantity={product.quantity}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex flex-col justify-between relative bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.imageCover}
            alt={""}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />

          {/* Wishlist Button */}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleWishlist(product._id)}
            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
          >
            <Heart
              className={`h-5 w-5 ${isWishlisted(product._id) ? "text-red-500 fill-red-500" : "text-gray-500"}`}
            />
          </Button>

          {/* Badge for sold items */}
          {product.sold > 100 && (
            <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
              Popular
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="px-4 pt-4">
          {/* Brand */}
          <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
            <Link
              href={`/brands/${product.brand._id}`}
              className="hover:text-primary hover:underline transition-colors"
            >
              {product.brand.name}
            </Link>
          </p>

          {/* Title */}
          <h3 className="font-semibold text-sm mb-2 line-clamp-1 hover:text-primary transition-colors">
            <Link href={`/products/${product._id}`}>{product.title}</Link>
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">{renderStars(product.ratingsAverage)}</div>
            <span className="text-xs text-muted-foreground">
              ({product.ratingsQuantity})
            </span>
          </div>

          {/* Category */}
          <p className="text-xs text-muted-foreground mb-2">
            <Link
              href={`/categories/${product.category._id}`}
              className="hover:text-primary hover:underline transition-colors"
            >
              {product.category.name}
            </Link>
          </p>

          {/* Price */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            <span className="text-xs text-muted-foreground">
              {product.ratingsQuantity} sold
            </span>
          </div>
        </div>
      </div>
      <div className="p-4">
        {" "}
        {/* Add to Cart Button */}
        <AddProdcutCartButton
          addCartLoading={addCartLoading}
          handelAddToCart={() =>
            handelAddToCart!(product._id, setAddCartLoading)
          }
          productQuantity={product.quantity}
        />
      </div>
    </div>
  );
}
