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
import { useSession } from "next-auth/react"



const formSchema = z.object({

    resetCode: z
        .string()
        .regex(/^\d{6}$/, { message: "Reset code must be a 6-digit number" }),
})
export default function VerifyResetCodeForm() {
    const router = useRouter()
    const [isSingingIn, setIsSingingIn] = useState(false)
    const { data: session } = useSession();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            resetCode: ""
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSingingIn(true);
        try {
            const response = await apiServices.verifyResetCode(
                values.resetCode,
                session?.accessToken || ""
            );
            console.log(response)

            if (response.status == "Success") {
                router.push('/auth/resetPassword');
                toast.success("Reset code verified", { duration: 4000, });
            }
            if (response.status == "fail") {
                toast.error(response.message, { duration: 4000, });
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
                            name="resetCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>reset Code</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="******"
                                            type="text"
                                            max={6}
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