"use client"
import { LoadingSpinner } from "@/components";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Allorders() {
  const router = useRouter()


  useEffect(() => {
    router.push('/products')
  }, [])


  return (
    <div>
      <h1 className=" text-center font-extrabold p-20 text-5xl">
        <LoadingSpinner />
      </h1>
    </div>
  );
}
