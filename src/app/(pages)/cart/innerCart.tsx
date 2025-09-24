"use client"

import { Button } from '@/components'
import CartProduct from '@/components/products/CartProduct'
import { CartContext } from '@/contexts/cartContext'
import { formatPrice } from '@/helpers/currency'
import { Product } from '@/interfaces'
import { CartProduct as ICartProduct, GetUserCartResponse } from '@/interfaces/cart'
import { apiServices } from '@/services/api'
import { Loader, Loader2, Trash2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface InnerCartProps {
    cartData: GetUserCartResponse
}

export default function InnerCart({ cartData }: InnerCartProps) {
    const [innerCartData, setInnerCartData] = useState<GetUserCartResponse>(cartData)
    const [isClearCart, setIsClearCart] = useState(false)
    const { setCartCount } = useContext(CartContext)
    const [isChickOutLoading, setIsChickOutLoading] = useState(false)
    const { data: session } = useSession()

    useEffect(() => {
        setCartCount!(innerCartData.numOfCartItems)
    }, [innerCartData, setCartCount])

    async function updateCart() {
        const newCartData = await apiServices.grtUserCart(session?.accessToken || "")
        setInnerCartData(newCartData)
    }

    async function handelRemoveProduct(
        productId: string,
        setIsRemovingProduct: (value: boolean) => void
    ) {
        setIsRemovingProduct(true)
        await apiServices.removeCartProduct(productId, session?.accessToken || "")
        toast.success("Product Removed", { position: "bottom-right" })
        setIsRemovingProduct(false)
        updateCart()
    }

    async function handelClearCart() {
        setIsClearCart(true)
        await apiServices.clearCart(session?.accessToken || "")
        toast.success("Cart Cleared", { position: "bottom-right" })
        updateCart()
        setIsClearCart(false)
    }

    async function handelUpdateProductCount(id: string, count: number) {
        await apiServices.updateCartProductCount(id, count, session?.accessToken || "")
        updateCart()
    }

    async function handelChickOut() {
        setIsChickOutLoading(true)
        const response = await apiServices.cheackOut(innerCartData.cartId, session?.accessToken || "")
        setIsChickOutLoading(false)
        location.href = response.session.url
    }

    return (
        <>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3x1 font-bold mb-4">Shopping Cart</h1>
                <p className="text-muted-foreground">
                    {innerCartData.numOfCartItems} item
                    {innerCartData.numOfCartItems > 1 ? "s" : ""} in your cart
                </p>
            </div>

            {innerCartData.numOfCartItems > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="space-y-4">
                            {innerCartData.data.products.map((cartItem: ICartProduct<Product>) => (
                                <CartProduct
                                    key={cartItem._id}
                                    handelRemoveProduct={handelRemoveProduct}
                                    item={cartItem}
                                    handelUpdateProductCount={handelUpdateProductCount}
                                />
                            ))}

                            {/* Clear Cart */}
                            <div className="mt-6">
                                <Button
                                    disabled={isClearCart}
                                    onClick={handelClearCart}
                                    className="cursor-pointer"
                                    variant="destructive"
                                >
                                    {isClearCart ? (
                                        <Loader2 className="animate-spin" />
                                    ) : (
                                        <Trash2 className="h-4 w-4 mr-2" />
                                    )}
                                    Clear Cart
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="border rounded-lg p-6 sticky top-4">
                            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between">
                                    <span>Subtotal ({innerCartData.numOfCartItems} items)</span>
                                    <span>{formatPrice(innerCartData.data.totalCartPrice)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                            </div>
                            <hr className="my-4" />
                            <div className="flex justify-between font-semibold text-lg mb-6">
                                <span>Total</span>
                                <span>{formatPrice(innerCartData.data.totalCartPrice)}</span>
                            </div>
                            <Button
                                disabled={isChickOutLoading}
                                onClick={handelChickOut}
                                className="w-full"
                                size="lg"
                            >
                                {isChickOutLoading ? <Loader className="animate-spin" /> : "Proceed to Checkout"}
                            </Button>
                            <Button variant="outline" className="w-full mt-2" asChild>
                                <Link href="/products">Continue Shopping</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-4 text-gray-600">
                        No Product in your cart
                    </h2>
                    <Button variant="ghost" className="w-fit mt-2" asChild>
                        <Link href="/products">Add one</Link>
                    </Button>
                </div>
            )}
        </>
    )
}
