
import { ProductsResponse, SingleProductResponse, BrandsResponse, SingleBrandResponse, CategoriesResponse, SingleCategoryResponse } from './../types/responses';
import { AddToCartResponse, GetUserCartResponse } from '@/interfaces/cart';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
class ApiServices {
    #baseUrl: string = "";
    constructor() {
        this.#baseUrl = baseUrl ?? "";
    }
    #getHeaders(token?: string) {
        return {
            "Content-Type": "application/json",
            ...(token ? { token } : {}),
        };
    }
    async getAllProduct(): Promise<ProductsResponse> {
        return await fetch(this.#baseUrl + "api/v1/products")
            .then((res) => res.json())
    }
    async getProductDitails(id: string): Promise<SingleProductResponse> {
        return await fetch(this.#baseUrl + "api/v1/products/" + id)
            .then((res) => res.json())
    }
    async getAllBrands(): Promise<BrandsResponse> {
        return await fetch(this.#baseUrl + "api/v1/brands")
            .then((res) => res.json())
    }
    async getBrandsDitails(id: string): Promise<SingleBrandResponse> {
        return await fetch(this.#baseUrl + "api/v1/brands/" + id)
            .then((res) => res.json())
    }
    async getAllCategories(): Promise<CategoriesResponse> {
        return await fetch(this.#baseUrl + "api/v1/categories")
            .then((res) => res.json())
    }
    async getCategoriesDitails(id: string): Promise<SingleCategoryResponse> {
        return await fetch(this.#baseUrl + "api/v1/categories/" + id)
            .then((res) => res.json())
    }



    async addProductToCart(productId: string, token: string): Promise<AddToCartResponse> {
        return await fetch(this.#baseUrl + 'api/v1/cart', {
            method: 'post',
            body: JSON.stringify({
                productId
            }),
            headers: this.#getHeaders(token)
        }).then((res) => res.json())
    }

    async grtUserCart(token: string): Promise<GetUserCartResponse> {
        return await fetch(this.#baseUrl + "api/v1/cart",
            {
                method: "GET",
                headers: this.#getHeaders(token),
            }
        ).then((res) => res.json())
    }
    async removeCartProduct(id: string, token: string) {
        return await fetch(this.#baseUrl + 'api/v1/cart/' + id, {
            headers: this.#getHeaders(token),
            method: 'delete'
        }).then((res) => res.json())
    }
    async clearCart(token: string) {
        return await fetch(this.#baseUrl + 'api/v1/cart', {
            headers: this.#getHeaders(token),
            method: 'delete'
        }).then((res) => res.json())
    }
    async updateCartProductCount(id: string, count: number, token: string) {
        return await fetch(this.#baseUrl + 'api/v1/cart/' + id, {

            method: 'put',
            body: JSON.stringify({
                count
            }),
            headers: this.#getHeaders(token)

        }).then((res) => res.json())
    }
    async cheackOut(cartId: string, token: string) {
        return await fetch(baseUrl + 'api/v1/orders/checkout-session/' + cartId + '?url=http://localhost:3000', {
            headers: this.#getHeaders(token),
            method: "post",
            body: JSON.stringify({
                "shippingAddress": {
                    "details": "details",
                    "phone": "01010700999",
                    "city": "Cairo"
                }
            })
        }).then((res) => res.json())
    }
    //         Authentication
    async signup(name: string, email: string, password: string, rePassword: string, phone: string, token?: string) {
        return await fetch(baseUrl + 'api/v1/auth/signup', {
            body: JSON.stringify({
                name,
                email,
                password,
                rePassword,
                phone,
            }),
            method: "POST",
            headers: this.#getHeaders(token)
        }).then((res) => res.json())
    }
    async login(email: string, password: string) {
        return await fetch(baseUrl + 'api/v1/auth/signin', {
            body: JSON.stringify({
                email,
                password,
            }),
            method: "POST",
            headers: this.#getHeaders()
        }).then((res) => res.json())
    }
    async forgotPasswords(email: string, token?: string) {
        return await fetch(baseUrl + 'api/v1/auth/forgotPasswords', {
            body: JSON.stringify({
                email,
            }),
            method: "POST",
            headers: this.#getHeaders(token)
        }).then((res) => res.json())
    }
    async verifyResetCode(resetCode: string, token?: string) {
        return await fetch(baseUrl + 'api/v1/auth/verifyResetCode', {
            body: JSON.stringify({
                resetCode,
            }),
            method: "POST",
            headers: this.#getHeaders(token)
        }).then((res) => res.json())
    }
    async resetPassword(email: string, newPassword: string, token?: string) {
        return await fetch(baseUrl + 'api/v1/auth/resetPassword', {
            body: JSON.stringify({
                email,
                newPassword,
            }),
            method: "PUT",
            headers: this.#getHeaders(token)
        }).then((res) => res.json())
    }
    async addProductToWishList(productId: string, token: string) {
        return await fetch(baseUrl + 'api/v1/wishlist', {
            body: JSON.stringify({
                productId,
            }),
            method: "POST",
            headers: this.#getHeaders(token)
        }).then((res) => res.json())
    }
    async removeProductFromWishList(productId: string, token: string) {
        return await fetch(baseUrl + 'api/v1/wishlist/' + productId, {
            method: "DELETE",
            headers: this.#getHeaders(token)
        }).then((res) => res.json())
    }
    async getWishlist(token: string) {
        return await fetch(baseUrl + 'api/v1/wishlist', {
            method: "GET",
            headers: this.#getHeaders(token)
        }).then((res) => res.json())
    }
    getProductById(productId: string, token?: string) {
        return fetch(baseUrl + 'api/v1/products/' + productId, {
            method: "get",
            headers: this.#getHeaders(token)
        }).then((res) => res.json())
    }
}
export const apiServices = new ApiServices()