import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import credentials from "next-auth/providers/credentials"
import { fetchUserByEmail } from "./lib/data"
import bcrypt from 'bcryptjs'
import Resend from "next-auth/providers/resend"

const prisma = new PrismaClient()

export const { handlers, signIn, signOut, auth } = NextAuth({
    session: {
        //https://authjs.dev/concepts/session-strategies#database
        strategy: 'jwt',

    },
    adapter: PrismaAdapter(prisma),
    providers: [
        credentials({
            credentials: {
                email: { label: "Email", type: "email", placeholder: "example@example.com" },
                password: { label: "Password", type: "password" }
            },
            authorize: async (credentials) => {
                // 資格情報が有効であることを示すユーザー オブジェクトを返すと、
                // そのオブジェクトは JSON Web トークンに保持され、その後オブジェクトを拒否するカスタムのsignIn() コールバックが構成されていない限り、ユーザーはサインインします。
                // null を返すと、ユーザーに詳細を確認するよう促すエラーが表示されます。
                // エラーをスローすると、ユーザーはエラー メッセージをクエリ パラメータとして含むエラー ページに送信されます。
                try {
                    if (! credentials?.email || ! credentials?.password) return null
                    
                    const user = await fetchUserByEmail(credentials.email)
                    if (! user) return null

                    const isCorrectPassword = await bcrypt.compare(credentials.password, user.password)
                    if (! isCorrectPassword) return null

                    return user
                } catch(err) {
                    throw new Error('ログイン失敗')
                }
            },
        }),
        Resend({
            id: 'user-resend',
            apiKey: process.env.RESEND_API_KEY,
            from: process.env.RESEND_FROM
        })
    ],
    callbacks: {
        // https://authjs.dev/reference/core
        jwt({token, trigger, session}) {
            // このコールバックは、JSON Web Token が作成されたとき（サインイン時など）や更新されたとき
            //（クライアントでセッションにアクセスしたときなど）に呼び出されます。
            // ここで返されるものはすべて JWT に保存され、セッション・コールバックに転送されます。
            // そこで、クライアントに返すべきものを制御できます。
            // それ以外のものは、フロントエンドから保持されます。JWTはデフォルトでAUTH_SECRET環境変数によって暗号化されます。
            return token
        },
        session({ session, token, user, trigger, newSession }) {
            // このコールバックは、セッションがチェックされるたびに呼び出されます
            //（useSessionやgetSessionを使用して/api/sessionエンドポイントを呼び出した場合など）
            //戻り値はクライアントに公開されるので、ここで返す値には注意してください！
            //JWTコールバックを通してトークンに追加したものをクライアントが利用できるようにしたい場合は、ここでも明示的に返す必要があります。
            return session
        },
        async signIn({ user, account, profile, email, credentials }) {
            // コールバックを使用して、signIn()ユーザーにサインインを許可するかどうかを制御します。
            // 許可する場合はtrueを返す
            // デフォルトのエラーメッセージを表示するにはfalseを、あるいはリダイレクト先を指定することもできる
            console.log({
                'user': user,
                'account': account,
                'profile': profile,
                'email': email,
                'credentials': credentials,
            })
            if (account?.provider === "credentials") return true
            return true
            /*if (! user.email) return false
            const existingUser = await fetchUserByEmail(user.email)

            if (! existingUser?.emailVerified) return false
            return true*/

            /**
             * {
                user: {
                    id: 'c6a34923-8f49-49b2-b4f3-ea6012b470e9',
                    email: 'sasaki123.321ikasas@gmail.com',
                    emailVerified: null
                },
                account: {
                    providerAccountId: 'sasaki123.321ikasas@gmail.com',
                    userId: 'c6a34923-8f49-49b2-b4f3-ea6012b470e9',
                    type: 'email',
                    provider: 'resend'
                },
                profile: undefined,
                email: { verificationRequest: true },
                credentials: undefined
            }
             */
        }
    },
})