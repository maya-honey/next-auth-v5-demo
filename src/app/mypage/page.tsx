import { auth } from "@/auth"


export default async function MyPage() {
    const session = auth()
    console.log(session)
    return (
        <div>
            <h2>Mypage</h2>
            <div>
                <p>session情報（サーバーサイドでセッション取得）</p>
                <pre className="py-6 px-4 whitespace-pre-wrap break-all">
                    {JSON.stringify(session, null, 2)}
                </pre>
            </div>
        </div>
    )
}