// import { Category, Subcategory } from './category';
// import { Brand } from './brand';

// export interface Product {
//   _id: string;
//   id: string;
//   title: string;
//   slug: string;
//   description: string;
//   quantity: number;
//   price: number;
//   sold: number;
//   imageCover: string;
//   images?: string[];
//   category: Category;
//   subcategory: Subcategory[];
//   brand: Brand;
//   ratingsAverage: number;
//   ratingsQuantity: number;
//   createdAt: string;
//   updatedAt: string;

// }

import { number } from "zod"
import { Brand } from "./brand"
import { Category, Subcategory } from "./category"

// المنتج الأساسي (موحد)
export interface Product {
  _id: string
  id: string
  title: string
  description: string
  slug: string
  quantity: number
  price: number
  imageCover: string
  images: string[]
  category: Category
  subcategory: Subcategory[]
  brand: Brand
  ratingsAverage: number
  ratingsQuantity: number
  createdAt: string
  updatedAt: string
  sold: number
}