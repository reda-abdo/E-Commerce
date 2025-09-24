"use client"

import Image from "next/image"
import Link from "next/link"
import React, { useState } from "react"
import { Button } from "../ui"
import { Loader, Minus, Plus, Trash2 } from "lucide-react"
import { Product } from "@/interfaces"
import { CartProduct as CartProductI } from "@/interfaces/cart"
import { formatPrice } from "@/helpers/currency"

interface CartProductProps {
    item: CartProductI<Product>
    handelRemoveProduct: (
        productId: string,
        setIsRemovingProduct: (value: boolean) => void
    ) => void
    handelUpdateProductCount: (productId: string, count: number) => void
}

export default function CartProduct({
    item,
    handelRemoveProduct,
    handelUpdateProductCount,
}: CartProductProps) {
    const [isRemovingProduct, setIsRemovingProduct] = useState(false)
    const [productCount, setProductCount] = useState(item.count)
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>()

    async function handelUpdateCount(count: number) {
        setProductCount(count)

        if (timeoutId) clearTimeout(timeoutId)

        const id = setTimeout(() => {
            handelUpdateProductCount(item.product._id, count)
        }, 500)

        setTimeoutId(id)
    }

    return (
        <div key={item._id} className="flex gap-4 p-4 border rounded-lg">
            {/* Product Image */}
            <div className="relative w-20 h-20 flex-shrink-0">
                <Image
                    src={item.product.imageCover} // ✅ الصورة الصح
                    alt={item.product.title}
                    fill
                    className="object-cover rounded-md"
                    sizes="80px"
                />
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
                <h3 className="font-semibold line-clamp-2">
                    <Link
                        href={`/products/${item.product._id}`}
                        className="hover:text-primary transition-colors cursor-pointer"
                    >
                        {item.product.title}
                    </Link>
                </h3>
                <p className="text-sm text-muted-foreground">
                    {item.product.brand?.name}
                </p>
                <p className="font-semibold text-primary mt-2">
                    {formatPrice(item.price)}
                </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col items-end gap-2">
                <Button
                    onClick={() => handelRemoveProduct(item.product._id, setIsRemovingProduct)}
                    variant="ghost"
                    size="sm"
                    className="cursor-pointer"
                >
                    {isRemovingProduct ? (
                        <Loader className="animate-spin" />
                    ) : (
                        <Trash2 className="h-4 w-4" />
                    )}
                </Button>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                    <Button
                        disabled={productCount === 1}
                        onClick={() => handelUpdateCount(productCount - 1)}
                        variant="outline"
                        size="sm"
                    >
                        <Minus className="h-4 w-4" />
                    </Button>

                    <span className="w-8 text-center">{productCount}</span>

                    <Button
                        onClick={() => handelUpdateCount(productCount + 1)}
                        variant="outline"
                        size="sm"
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
