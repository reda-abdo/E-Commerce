"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { apiServices } from "@/services/api";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

interface WishHeartContextType {
    wishlist: string[];
    toggleWishlist: (productId: string) => void;
    isWishlisted: (productId: string) => boolean;
}
interface itemI {
    _id: string[];

}

const WishHeartContext = createContext<WishHeartContextType | undefined>(undefined);

export const WishHeartProvider = ({ children }: { children: ReactNode }) => {
    const [wishlist, setWishlist] = useState<string[]>([]);
    const { data: session } = useSession();

    useEffect(() => {
        async function fetchWishlist() {
            try {
                const res = await apiServices.getWishlist(session?.accessToken || "");
                const ids = res.data.map((item: itemI) => item._id);
                setWishlist(ids);
            } catch (error) {
                console.error("Error loading wishlist:", error);
            }
        }
        fetchWishlist();
    }, []);

    const toggleWishlist = async (productId: string) => {
        try {
            if (wishlist.includes(productId)) {
                const res = await apiServices.removeProductFromWishList(productId, session?.accessToken || "");
                if (res.status === "success") {
                    setWishlist((prev) => prev.filter((id) => id !== productId));
                    toast.success(res.message);
                }
            } else {
                const res = await apiServices.addProductToWishList(productId, session?.accessToken || "");
                if (res.status === "success") {
                    setWishlist((prev) => [...prev, productId]);
                    toast.success(res.message);
                }
            }
        } catch (error) {
            console.error("Wishlist error:", error);
            toast.error("Something went wrong");
        }
    };

    const isWishlisted = (productId: string) => wishlist.includes(productId);

    return (
        <WishHeartContext.Provider value={{ wishlist, toggleWishlist, isWishlisted }}>
            {children}
        </WishHeartContext.Provider>
    );
};

export const useWishHeart = () => {
    const context = useContext(WishHeartContext);
    if (!context) throw new Error("useWishHeart must be used within WishHeartProvider");
    return context;
};
