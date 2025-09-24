// // interfaces/cart.ts

// import { Brand } from "./brand"
// import { Category, Subcategory } from "./category"

// // استجابة إضافة منتج للكارت
// export interface AddToCartResponse {
//     status: string
//     message: string
//     numOfCartItems: number
//     cartId: string
//     data: CartResponseData<string>
// }

// export interface GetUserCartResponse {
//     status: string
//     message: string
//     numOfCartItems: number
//     cartId: string
//     data: CartResponseData<Product>   // ✅ بقى object مش array
//     token?: string
// }

// // الـ data الأساسي للكارت
// export interface CartResponseData<T> {
//     _id: string
//     cartOwner: string
//     products: CartProduct<T>[]
//     createdAt: string
//     updatedAt: string
//     __v: number
//     totalCartPrice: number
// }

// // عنصر واحد داخل الكارت
// export interface CartProduct<T> {
//     count: number
//     _id: string
//     product: T
//     price: number
// }

// // المنتج الأساسي
// export interface Product {
//     _id: string
//     id: string
//     title: string
//     category: Category
//     subcategory: Subcategory[]
//     brand: Brand
//     ratingsAverage: number
// }

import { Product } from "./product"

// استجابة إضافة منتج للكارت
export interface AddToCartResponse {
    status: string
    message: string
    numOfCartItems: number
    cartId: string
    data: CartResponseData<string>
}

export interface GetUserCartResponse {
    status: string
    message: string
    numOfCartItems: number
    cartId: string
    data: CartResponseData<Product>   // ✅ بيستخدم Product من product.ts
    token?: string
}

// الـ data الأساسي للكارت
export interface CartResponseData<T> {
    _id: string
    cartOwner: string
    products: CartProduct<T>[]
    createdAt: string
    updatedAt: string
    __v: number
    totalCartPrice: number
}

// عنصر واحد داخل الكارت
export interface CartProduct<T> {
    count: number
    _id: string
    product: T
    price: number
}
