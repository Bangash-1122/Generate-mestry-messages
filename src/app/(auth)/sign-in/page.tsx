'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useDebounceValue } from 'usehooks-ts'
import { Toaster } from "@/components/ui/sonner"
import axios , {AxiosError} from "axios";
import { ApiResponse } from "@/types/apiResponse";

const page = () => {
    const [username, setUsername] = useState('')
    const [usernameMessage, setUsernameMessage] = useState('')
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const debouncedUsername = useDebounceValue(username, 300)
    const { toast } = useToast()
    const router = useRouter();

    // Zod implementation
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    })

    useEffect(() => {
        const checkUsernameUnique = async () => {
            if(debouncedUsername){
            setIsCheckingUsername(true)
            setUsernameMessage('')
            try {
                const response = await axios.get(`/api/check-username?username=${debouncedUsername}`)
                setUsernameMessage(response.data.message)
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                setUsernameMessage(axiosError.response?.data.message || "Error while checking username");
            }finally {
                setIsCheckingUsername(false)
            }
            }
        }
        checkUsernameUnique()
    }, [debouncedUsername])

    return (
        <div>
            
        </div>
    )
}

export default page