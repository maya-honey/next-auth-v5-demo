'use client'
import Button from "@/components/atoms/Button/Button";
import request from "@/lib/request";
import { getMaxListeners } from "events";
import { signIn } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function AdminSignup() {
    const [input, setInput] = useState<{
        name: string,
        email: string,
        role: number | null,
        password: string
    
    }>({
        name: '',
        email: '',
        role: null,
        password: ''
    })

    const [errors, setErrors] = useState<string[]>([])

    const router = useRouter()

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const res = await request.post('/api/admin/signup', {...input})
        if (!res.data.user || res.data.error) {
            setErrors([res.data.error] || ['ユーザー登録に失敗しました'])
            return
        } 

        router.push("/admin/signin")
    }
    return (
        <div
            style={{ height: "88vh" }}
            className="flex flex-col justify-center sm:px-6 lg:px-8"
        >
            <Head>
                <title>管理者アカウントを作成</title>
            </Head>
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    管理者アカウントを作成
                </h2>
            </div>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form onSubmit={onSubmit}>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                お名前
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setInput({...input, name: e.target.value})}}
                            />
                        </div>
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
                                htmlFor="role"
                                className="block text-sm font-medium text-gray-700"
                            >
                                権限レベル
                            </label>
                            <select
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                name="role"
                                id="role"
                                required
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {if (Number(e.target.value) !== 0) setInput({...input, role: Number(e.target.value)})}}
                            >
                                <option value="">--権限を選んで--</option>
                                <option value="1">管理者権限</option>
                                <option value="3">CS権限</option>
                                <option value="5">管理部権限</option>
                                <option value="6">エンジニア権限</option>
                                <option value="7">CSリード権限</option>
                            </select>
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
                                新規登録
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