"use client"

import { Button, LoadingSpinner, ProductCard } from '@/components'
import { Brand, Product } from '@/interfaces'
import { apiServices } from '@/services/api'
import { SingleBrandResponse, ProductsResponse } from '@/types'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import React, { useEffect, useState, useCallback } from 'react'

export default function BrandPage() {
  const [brand, setBrand] = useState<Brand | null>(null)
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [brandProducts, setBrandProducts] = useState<Product[]>([])
  const [isProductsLoading, setIsProductsLoading] = useState(false)

  const fetchBrandsDitails = useCallback(async () => {
    try {
      setLoading(true)
      const data: SingleBrandResponse = await apiServices.getBrandsDitails(String(id))
      setBrand(data.data)
    } catch (err) {
      setError("Failed to load brand details")
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchBrandsDitails()
  }, [fetchBrandsDitails])

  useEffect(() => {
    const fetchProductsForBrand = async () => {
      if (!brand) return
      setIsProductsLoading(true)
      try {
        const all: ProductsResponse = await apiServices.getAllProduct()
        const filtered = all.data.filter(
          (p: Product) => p.brand && p.brand._id === brand._id
        )
        setBrandProducts(filtered)
      } catch {
        setError("Failed to load products")
      } finally {
        setIsProductsLoading(false)
      }
    }
    fetchProductsForBrand()
  }, [brand])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  if (!brand) {
    return <p className="text-red-500">Brand not found</p>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
        <div className="relative w-32 h-32 flex-shrink-0">
          <Image
            src={brand.image}
            alt={brand.name}
            fill
            className="object-contain rounded-md"
            sizes="128px"
          />
        </div>

        <div className="flex-1 min-w-0 mt-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-extrabold text-3xl line-clamp-2">{brand.name}</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            Discover products from {brand.name}
          </p>
        </div>
      </div>

      {isProductsLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 gap-8 mt-8 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-muted-foreground mb-4">
              {brandProducts.length} products are available from {brand.name}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {brandProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
