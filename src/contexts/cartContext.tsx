
"use client";

import { apiServices } from "@/services/api";
import { useSession } from "next-auth/react";
import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import toast from "react-hot-toast";

type createContextType = {
    cartCount?: number;
    setCartCount?: React.Dispatch<SetStateAction<number>>;
    isLoading?: boolean;
    handelAddToCart?: (prodyctId: string, setAddCartLoading: Dispatch<SetStateAction<boolean>>) => Promise<void>

}


export const CartContext = createContext<createContextType>({});

export default function CreateContextProvider({ children }: { children: ReactNode }) {
    const [cartCount, setCartCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false)
    const { data: session } = useSession();


    async function handelAddToCart(prodyctId: string, setAddCartLoading: Dispatch<SetStateAction<boolean>>) {
        setAddCartLoading(true)
        const data = await apiServices.addProductToCart(prodyctId, session?.accessToken || "")
        setAddCartLoading(false)
        toast.success(data.message)
        setCartCount(data.numOfCartItems)

    }

    async function getCart() {
        setIsLoading(true)
        const response = await apiServices.grtUserCart(session?.accessToken || "")
        setCartCount(response.numOfCartItems)
        setIsLoading(false)
    }
    useEffect(() => {
        getCart()
    }, [])


    return (
        <CartContext.Provider value={{ cartCount, setCartCount, isLoading, handelAddToCart }}>
            {children}
        </CartContext.Provider>
    );
}
