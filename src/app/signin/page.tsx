'use client'
import Button from "@/components/atoms/Button/Button";
// import { signIn } from "@/auth"
import { signIn } from "next-auth/react";
// import { signIn } from "next-auth/react";
import Head from "next/head";
import React, { useState } from "react";

export default function Signin() {
    const [input, setInput] = useState({
        email: '',
        password: ''
    })

    const [errors, setErrors] = useState<string[]>([])

    return (
        <div
            style={{ height: "88vh" }}
            className="flex flex-col justify-center sm:px-6 lg:px-8"
        >
            <Head>
                <title>ログイン</title>
            </Head>
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    ログイン
                </h2>
            </div>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form 
                        action={async () => {
                            await signIn("credentials", {
                                email: input.email,
                                password: input.password,
                                redirectTo: '/',
                            })
                        }}
                    >
                        <div className="mt-6">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                メールアドレス
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setInput({...input, email: e.target.value})}}
                            />
                        </div>
                        <div className="mt-6">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                パスワード
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setInput({...input, password: e.target.value})}}
                            />
                        </div>
                        <div className="mt-6">
                            <Button
                                type="submit"
                                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                ログイン
                            </Button>
                        </div>
                    </form>
                    {errors.map((error) => (
                        <div key={error} className="mt-6 text-center text-sm text-red-600">
                            {error}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}