"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {  z } from "zod"
import Link from "next/link"



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
import { apiServices } from "@/services/api"
import toast from "react-hot-toast"

const formSchema = z.object({
    name: z
        .string()
        .min(3, { message: "Name must be at least 3 characters" })
        .max(50, { message: "Name must be less than 50 characters" }),

    email: z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "Invalid email address" }),


    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters" })
        .max(50, { message: "Password is too long" })
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,50}$/,
            { message: "Password must include uppercase, lowercase, number, and special character" }
        ),

    rePassword: z
        .string()
        .min(6, { message: "Confirm password must be at least 6 characters" }),

    phone: z
        .string()
        .regex(/^01[0-2,5]{1}[0-9]{8}$/, { message: "Invalid phone number" }), // Egyptian format
}).refine((data) => data.password === data.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"],
});


export default function RegisterForm() {

    const router = useRouter()
    const [isSingingIn, setIsSingingIn] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            rePassword: "",
            phone: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSingingIn(true);
        try {
            const response = await apiServices.signup(
                values.name,
                values.email,
                values.password,
                values.rePassword,
                values.phone,

            );
            console.log(response)

            if (response.message == "success") {
                toast.success(response.message, {
                    position: "bottom-right",
                    duration: 3000,
                })
                router.push('/auth/login');
            }
            if (response.statusMsg == "fail") {
                toast.error(response.message, {
                    position: "bottom-right",
                    duration: 3000,
                })
            }
        } catch (error) {
            alert(JSON.stringify(error));
        }
        setIsSingingIn(false);
    }


    return (
        <div className="max-w-3xl p-10 mx-auto">
            <div className="py-20">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your name"
                                            type="name"
                                            {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                        <FormField
                            control={form.control}
                            name="rePassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Conferm Password</FormLabel>
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

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your phone number"
                                            type="tel"
                                            {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button disabled={isSingingIn} onClick={() => onSubmit} type="submit">
                            {isSingingIn && <Loader2 className="animate-spin" />}
                            Register
                        </Button>
                        <div>

                            <Link className="pl-1 text-red-700 text-lg   font-bold" href='/auth/login'>
                                i already have acount
                            </Link>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}