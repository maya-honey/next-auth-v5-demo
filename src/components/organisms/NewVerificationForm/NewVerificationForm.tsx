"use client"

import { newVerification } from "@/actions/newVerification";
import Button from "@/components/atoms/Button/Button";
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react";

export const NewVerificationForm = () => {
    const router = useRouter()
    const [error, setError] = useState<string | undefined>()
    const [success, setSuccess] = useState<string | undefined>()
    const [userInfo, setUserInfo] = useState<{email: string, password: string} | undefined>()

    const searchParams = useSearchParams();
    const token = searchParams.get('token')

    const onSubmit = useCallback((e) => {
        e.preventDefault

        setError(undefined)
        setSuccess(undefined)
        
        if (!token) {
            setError("tokenがないよ！")
            return
        }
        newVerification(token).then((data) => {
            setError(data.error)
            setSuccess(data.success)
            if (data.success && !data.error) {
                setUserInfo(data.user)
            }
        }).catch(() => {
            setError('Something error')
        })
    }, [token])

    return (
        <div>
            New Verification Form
            <form action={onSubmit}>
                <Button
                    className="w-90 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    type="submit">本登録する</Button>
            </form>
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
            {
                userInfo?.email && userInfo?.password && (
                    <div className="py-8">
                        <p>ログイン情報</p>
                        <p>email: {userInfo?.email}</p>
                        <p>password: {userInfo?.password}</p>
                    </div>
                )
            }
        </div>
    )
}