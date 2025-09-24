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
import { apiServices } from "@/services/api"
import { Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import { useEmail } from "@/contexts/emailContext"
import { useSession } from "next-auth/react"



const formSchema = z.object({

    password: z
        .string()
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,50}$/,
            { message: "Password must include uppercase, lowercase, number, and special character" }
        ),


})


export default function VerifyResetCodeForm() {

    const router = useRouter()
    const [isSingingIn, setIsSingingIn] = useState(false)
    const { email } = useEmail()
    console.log(email)
    const { data: session } = useSession();


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: ""
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSingingIn(true);
        try {
            const response = await apiServices.resetPassword(
                email,
                values.password,
                session?.accessToken || ""
            );
            console.log(response)

            if (response.token) {
                router.push('/auth/login');
                toast.success("success", {
                    position: "bottom-right",
                })
            }
            if (response.statusMsg == "fail") {
                toast.error(response.message, {
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
            toast.error(JSON.stringify(error), {
                position: "bottom-right",
            })
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
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Reset Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="*********"
                                            type="password"
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