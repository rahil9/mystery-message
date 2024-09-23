'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, {AxiosError} from 'axios'
import { APIResponse } from "@/types/APIResponse"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

const page = () => {

    const [username, setUsername] = useState("")
    const [usernameMessage, setUsernameMessage] = useState("")
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()
    const {toast} = useToast()
    const debouncedUsername = useDebounceValue(username, 500) 

    // zod implementation
    // <z.infer<typeof signUpSchema>> not necessary but a good ts practise 
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    })

    useEffect(() => {
        const checkUniqueUsername = async () => {
            if (debouncedUsername) {
                setIsCheckingUsername(true)
                setUsernameMessage('')
                try {
                    const respsonse = await axios.get(`/api/check-unique-username?username=${debouncedUsername}`)
                    setUsernameMessage(respsonse.data.message)
                } catch (error) {
                    const axiosError = error as AxiosError<APIResponse>
                    setUsernameMessage(axiosError.response?.data.message ?? "Error checking username")
                } finally {
                    setIsCheckingUsername(false)
                }
            }
        }
        checkUniqueUsername()
    }, [debouncedUsername])

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post<APIResponse>('/api/sign-up', data)
            toast({
                title: 'Success',
                description: response.data.message
            })
            router.replace(`/verify/${username}`)
        } catch (error) {
            console.error("error in sign-up of user", error)
            const axiosError = error as AxiosError<APIResponse>
            let errorMessage = axiosError.response?.data.message
            toast({
                title: 'Signup failed',
                description: errorMessage,
                variant: "destructive"
            })
            setIsSubmitting(false)
        }
    }

    return(
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold text-black tracking-tight lg:text-5xl mb-6">
                    Welcome Back to True Feedback
                </h1>
                <p className="mb-4">Sign in to continue your secret conversations</p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField name="username" control={form.control}
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-black">Username</FormLabel>
                            <Input {...field} placeholder="username" onChange={(e)=>{
                                field.onChange(e)
                                setUsername(e.target.value)}} />
                                {isCheckingUsername && <Loader2 className="animate-spin" />}
                                {!isCheckingUsername && usernameMessage && (
                                    <p
                                        className={`text-sm ${
                                        usernameMessage === 'Username is unique'
                                            ? 'text-green-500'
                                            : 'text-red-500'
                                        }`}
                                    >
                                        {usernameMessage}
                                    </p>
                                )}
                            <FormMessage />
                        </FormItem> 
                        
                    )} />
                    <FormField name="email" control={form.control}
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <Input {...field} placeholder="email" />
                            <FormMessage />
                        </FormItem> 
                    )} />
                    <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Password</FormLabel>
                        <Input type="password" placeholder="password" {...field} />
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button className='w-full' type="submit" disabled={isSubmitting}>
                        {
                            isSubmitting ? (
                                <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please Wait
                                </>
                            ) : ('Sign Up')
                        }
                    </Button>
                </form>
            </Form>
            <div className="text-center mt-4">
                <p>
                    Already a member?{' '}
                    <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                    Sign in
                    </Link>
                </p>
            </div>
            </div>
        </div>
    )
}

export default page;