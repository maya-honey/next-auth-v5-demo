'use client'
import Button from "@/components/atoms/Button/Button";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import Link from "next/link";

function HeaderComponent() {
    const { data, status } = useSession()
    
    return (
        <header className="flex justify-between">
            <div className="text-2xl"><Link href='/'>demo app</Link></div>
            <div className="flex gap-2">
                {
                    status !== 'loading' && data?.user ? (
                        <>
                        <Button
                            onClick={async() => {await signOut()}}
                            className="flex h-[48px] items-center justify-center rounded-md bg-gray-100 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
                        >ログアウト</Button>
                        </>
                    ) : (
                        <>
                        <Link
                            href='/signup'
                            className="flex h-[48px] items-center justify-center rounded-md bg-gray-100 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
                            >新規登録</Link>
                        <Link
                            href='/signin'
                            className="flex h-[48px] items-center justify-center rounded-md bg-gray-100 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
                            >ログイン</Link>
                        </>
                    )
                }
            </div>
        </header>
    )
}

export default function Header() {
    return (
        <SessionProvider>
            <HeaderComponent/>
        </SessionProvider>
    )
}