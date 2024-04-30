"use client"

import { newVerification } from "@/actions/newVerification";
import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react";

export const NewVerificationForm = () => {
    const [error, setError] = useState<string | undefined>()
    const [success, setSuccess] = useState<string | undefined>()

    const searchParams = useSearchParams();

    const token = searchParams.get('token')

    const onSubmit = useCallback(() => {
        setError(undefined)
        setSuccess(undefined)
        
        if (!token) {
            setError("missing token")
            return
        }
        newVerification(token).then((data) => {
            setError(data.error)
            setSuccess(data.success)
        }).catch(() => {
            setError('Something error')
        })
    }, [token])

    useEffect(() => {
        onSubmit()
    }, [onSubmit])

    return (
        <div>
            New Verification Foro
            {
                success && (
                    <div className="py-6">
                        <p>success</p>
                        {success ?? '-'}
                    </div>
                )
            }
            {
                !success && error && (
                    <div className="py-6">
                        <p>error</p>
                        <p>{error ?? '-'}</p>
                    </div>
                )
            }
        </div>
    )
}