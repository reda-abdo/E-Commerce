
"use client"

import { apiServices } from '@/services/api'
import InnerCart from './innerCart'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { GetUserCartResponse } from '@/interfaces/cart'
import { LoadingSpinner } from '@/components'

export default function CartPage() {
    const { data: session } = useSession()
    const [cartData, setCartData] = useState<GetUserCartResponse | null>(null)

    useEffect(() => {
        async function fetchCart() {
            if (session?.accessToken) {
                const data = await apiServices.grtUserCart(session.accessToken)
                setCartData(data)
            }
        }
        fetchCart()
    }, [session])

    if (!cartData) return <p className='flex justify-center items-center min-h-[400px]'>
        <LoadingSpinner />
    </p>

    return (
        <div className="container mx-auto px-4 pb-36 pt-8">
            <InnerCart cartData={cartData} />
        </div>
    )
}

