"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
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
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useEmail } from "@/contexts/emailContext"
import { Loader2 } from "lucide-react"
import { apiServices } from "@/services/api"
import toast from "react-hot-toast"
import { useSession } from "next-auth/react"

const formSchema = z.object({

    email: z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "Invalid email address" }),
})




export default function ForgotPasswordsForm() {
    const router = useRouter()
    const [isSingingIn, setIsSingingIn] = useState(false)
    const { setEmail } = useEmail();
    const { data: session } = useSession();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: ""
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSingingIn(true);
        try {
            const response = await apiServices.forgotPasswords(
                values.email,
                session?.accessToken || ""
            );
            console.log(response)
            if (response.statusMsg == "success") {
                setEmail(values.email);
                router.push('/auth/verifyResetCode');
                toast.success("Reset code sent to your email", {
                    position: "bottom-right"
                })
            }
            if (response.statusMsg == "fail") {
                toast.error("There is no user registered with this email address", {
                    position: "bottom-right",
                })
            }
            if (response.statusMsg == "error") {
                toast.error(response.message, {
                    position: "bottom-right",
                })
            }
        } catch (error) {
            alert(JSON.stringify(error));
        }
        setIsSingingIn(false);
    }

    return (
        <div className="max-w-3xl p-10 mx-auto">
            <div className="py-48">
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
                        <Button onClick={() => onSubmit} type="submit">
                            {isSingingIn && <Loader2 className="animate-spin" />}
                            Contain
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}