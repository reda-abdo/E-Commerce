import { Product } from '@/interfaces';
import { apiServices } from "@/services/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";




export const getAllProducts = createAsyncThunk('/products/getAllProducts', async () => {
    const { data } = await apiServices.getAllProduct()
    return data
})

const initialState: { products: Product[] } = {
    products: []
}

const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllProducts.pending, () => {
        })
        builder.addCase(getAllProducts.rejected, () => {
        })
        builder.addCase(getAllProducts.fulfilled, (state, action) => {
            state.products = action.payload


        })

    }
})

export const productsReducer = productsSlice.reducer 