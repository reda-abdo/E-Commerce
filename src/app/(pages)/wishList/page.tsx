"use client"
import { LoadingSpinner, ProductCard } from '@/components';
import { useWishHeart } from '@/contexts/whishHartContext';
import { Product } from '@/interfaces';
import { apiServices } from '@/services/api'
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'

export default function WishListPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode] = useState<"grid" | "list">("grid");
    const { wishlist } = useWishHeart();
    const { data: session } = useSession();

    useEffect(() => {
        async function fetchProducts() {
            try {
                if (wishlist.length === 0) {
                    setProducts([]);
                    return;
                }

                const productPromises = wishlist.map((id) =>
                    apiServices.getProductById(id, session?.accessToken || "")
                );
                const results = await Promise.all(productPromises);
                setProducts(results.map((res) => res.data));
            } catch (error) {
                console.error(error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, [wishlist, session?.accessToken]);

    if (loading) return <LoadingSpinner />;

    return (
        <div className='container mx-auto px-4 py-8'>
            <div className="flex gap-4 p-4 border rounded-lg hover:shadow-md mb-8 transition-shadow">
                <div className="flex-1 min-w-0 mx-10">
                    <h1 className="font-extrabold text-center text-3xl">Your Wish List</h1>
                </div>
            </div>

            <div className={`grid gap-6 ${viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                : "grid-cols-1"
                }`}>

                {products.length === 0 ? (
                    <p className="col-span-full text-center mt-8 py-">No products in wishlist.</p>

                ) : (
                    products.map((p) => <ProductCard key={p._id} product={p} viewMode={viewMode} />)
                )}

            </div>
        </div>
    );
}
