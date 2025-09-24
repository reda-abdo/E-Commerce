import { apiServices } from "@/services/api";
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [

        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "inter your email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                const response = await apiServices.login(credentials?.email ?? "", credentials?.password ?? "")
                console.log(response)
                console.log(response.token)

                if (response.message == 'success') {
                    const user = {
                        id: response.user.email,
                        name: response.user.name,
                        email: response.user.email,
                        role: response.user.role,
                        token: response.token,
                    }
                    return user
                } else {
                    return null
                }
            },
        })
    ],
    pages: {
        signIn: '/auth/login',
    },
    callbacks: {
        async session({ session, token }) {
            session.user.role = token.role as string;
            session.accessToken = token.accessToken as string;
            return session
        },
        async jwt({ token, user }) {

            if (user) {
                token.accessToken = user.token
                token.role = user.role
            }
            return token

        }
    },
    secret: process.env.AUTH_SECRET,
    session: {
        strategy: "jwt"
    }

})

export { handler as GET, handler as POST }