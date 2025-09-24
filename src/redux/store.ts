import { configureStore } from "@reduxjs/toolkit";
import { counterReducer } from "./slices/ciunterSlice";
import { productsReducer } from "./slices/productsSlice";




export const store = configureStore({
    reducer: {
        counter: counterReducer,
        products: productsReducer,
        // email:emailRrducer,

    }
})

export type RootState = ReturnType<typeof store.getState>


export type AppDispath = typeof store.dispatch