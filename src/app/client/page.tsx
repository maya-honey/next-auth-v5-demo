'use client'
import { SessionProvider, signOut, useSession } from "next-auth/react";

function ClientComponent() {
    const { data, status } = useSession()
    
    return (
        <div>
            <p>セッション情報｜クライアントでセッション情報取得（useSession）</p>
            {JSON.stringify(data, null, 2)}
        </div>
    )
}

export default function Client() {
    return (
        <SessionProvider>
            <ClientComponent/>
        </SessionProvider>
    )
}