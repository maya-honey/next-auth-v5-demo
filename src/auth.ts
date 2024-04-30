import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import credentials from "next-auth/providers/credentials"
import { fetchUserByEmail } from "./lib/data"
import bcrypt from 'bcrypt'
import nodemailer from "next-auth/providers/nodemailer"

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
        nodemailer({
            server: process.env.EMAIL_SERVER,
            from: process.env.EMAIL_FROM,
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
        signIn({ user, account, profile, email, credentials }) {
            // コールバックを使用して、signIn()ユーザーにサインインを許可するかどうかを制御します。
            // 許可する場合はtrueを返す
            // デフォルトのエラーメッセージを表示するにはfalseを、あるいはリダイレクト先を指定することもできる
            return true
        }
    },
})