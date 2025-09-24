import { getToken } from 'next-auth/jwt'
import { NextResponse, NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

    const token = await getToken({ req: request })
    console.log(token)
    console.log("token")

    if (token) {
        NextResponse.next()
    } else {

        return NextResponse.redirect(new URL('/auth/login', request.url))
    }

}

export const config = {
    matcher: '/cart',
}