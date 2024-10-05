'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
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
    const debounced = useDebounceCallback(setUsername, 500) 

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
            if (username) {
                setIsCheckingUsername(true)
                setUsernameMessage('')
                try {
                    const respsonse = await axios.get(`/api/check-unique-username?username=${username}`)
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
    }, [username])

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
                    Welcome to Mystery Feedback
                </h1>
                <p className="mb-4 text-gray-800">Sign up for having your first secret conversations</p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField name="username" control={form.control}
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-800">Username</FormLabel>
                            <Input {...field} placeholder="username" className="text-gray-800" onChange={(e)=>{
                                field.onChange(e)
                                debounced(e.target.value)}} />
                                {isCheckingUsername && <Loader2 className="animate-spin text-black" />}
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
                            <FormLabel className="text-gray-800">Email</FormLabel>
                            <Input {...field} placeholder="email" />
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
                <p className="text-gray-800">
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