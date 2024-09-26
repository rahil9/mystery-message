'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const page = () => {

    const router = useRouter()
    const {toast} = useToast()

    // zod implementation
    // <z.infer<typeof signUpSchema>> not necessary but a good ts practise 
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: ''
        }
    })

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        const result = await signIn('credentials', {
            redirect: false,
            identifier: data.identifier,
            password: data.password
        })

        if (result?.error) {
            if (result.error == 'CredentialsSignin') {
                toast({
                    title: "Login failed",
                    description: "Incorrect email/password",
                    variant: "destructive"
                })
            } else {
                toast({
                    title: "Error",
                    description: result.error,
                    variant: "destructive"
                })
            }
        }

        if (result?.url) {
            router.replace('/dashboard')
        }

    }

    return(
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold text-black tracking-tight lg:text-5xl mb-6">
                    Welcome to Mystery Feedback
                </h1>
                <p className="mb-4 text-gray-800">Sign in to continue your secret conversations</p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField name="identifier" control={form.control}
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-800">Email</FormLabel>
                            <Input {...field} placeholder="email"  className="text-gray-800" />
                            <FormMessage />
                        </FormItem> 
                    )} />
                    <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="text-gray-800">Password</FormLabel>
                        <Input type="password" className="text-gray-800" placeholder="password" {...field} />
                        <FormMessage />
                        </FormItem>
                    )} />
                    <Button className='w-full' type="submit">
                        Sign In
                    </Button>
                </form>
            </Form>
            <div className="text-center mt-4">
                <p className="text-gray-800">
                    Don't have an account?{' '}
                    <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
                    Sign up
                    </Link>
                </p>
            </div>
            </div>
        </div>
    )
}

export default page;