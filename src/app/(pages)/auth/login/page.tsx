"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { signIn } from "next-auth/react"


import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from "next/navigation"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import toast from "react-hot-toast"

interface LoginForm {
    email: string,
    password: string
}


const formSchema = z.object({
    email: z.
        string()
        .min(1, { message: "Email is required" })
        .email({ message: "Invalid email address" }),
    password: z.
        string()
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,50}$/,
            { message: "Password must include uppercase, lowercase, number, and special character" }
        ),

})

export default function LoginForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl") || "/products";
    const [isLoginIn, setIsLoginIn] = useState(false)
    async function onSubmit(data: LoginForm) {
        setIsLoginIn(true)
        try {
            const response = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            })
            console.log(response)
            if (response?.ok) {
                router.push(callbackUrl)
                toast.success("Login successful",
                    { position: "bottom-right", duration: 3000 })
            }
            if (response?.status == 401) {

                toast.error("Incorrect email or password",
                    { position: "bottom-right", duration: 3000 })
            }
        } catch (error) {
            alert(JSON.stringify(error))
        }
        setIsLoginIn(false)
    }

    return (
        <div className="max-w-3xl p-10 mx-auto">
            <div className="py-32">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Your_Email@gmail.com"
                                            type="email"
                                            {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="**************"
                                            type="password"
                                            {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button disabled={isLoginIn} type="submit">
                            {isLoginIn && <Loader2 className=" animate-spin" />}
                            Signin
                        </Button>
                        <div className="text-center ">
                            <Link
                                className=" text-cyan-950-700 text-lg p-0 m-0 font-bold"
                                href="/auth/forgotPasswords">
                                Forget Password
                            </Link>
                        </div>
                        <div>
                            i dont have acount
                            <Link className="pl-1 text-red-700 text-lg   font-bold" href="/auth/register">
                                create one
                            </Link>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}