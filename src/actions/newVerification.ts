"use server"
import { PrismaClient } from "@prisma/client"
import { fetchUserByEmail, fetchVerificationTokeByToken } from "@/lib/data"
import bcrypt from "bcryptjs"
const prisma = new PrismaClient()

async function createHash(message: string) {
    const data = new TextEncoder().encode(message)
    const hash = await crypto.subtle.digest("SHA-256", data)
    return Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
        .toString()
}

export async function newVerification(token: string) {

    // 参考：/node_modules/@auth/core/src/lib/actions/signin/send-token.ts
    const hashedToken = await createHash(`${token}${process.env.AUTH_SECRET}`)

    console.log('hashedTokenだぞぞぞ', hashedToken)
    const existingToken = await fetchVerificationTokeByToken(hashedToken)
    if (!existingToken) return {error: 'tokenがないよ！'}

    const hasExpired = new Date(existingToken.expires) < new Date()
    if (hasExpired) return {error: 'tokenの期限が切れてるよ!'}

    const existingUser = await fetchUserByEmail(existingToken.identifier)
    if (existingUser) return {error: 'ユーザーが既に存在しているよ!'}

    const hashedPassword = await bcrypt.hash("password", 10)

    await prisma.user.create({
        data: {
            name: Math.random().toString(32).substring(2),
            email: existingToken.identifier,
            emailVerified: new Date(),
            password: hashedPassword,
        }
    })

    await prisma.verificationToken.deleteMany({
        where: {
            identifier: existingToken.identifier,
        }
    })

    return { success: "本登録完了", user: {
        email: existingToken.identifier,
        password: 'password'
    }}
}

export async function sendVerificationRequest(params) {
    const { email, provider, url, theme, token } = params

    console.log('まとめだそおｓ', {
        email: email,
        provider: provider,
        url: url,
        theme: theme,
        token: token
    })

    const { host } = new URL(url)
    
    const linkUrl = host + "/auth/new-verification?token=" + token
    
    const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${provider.apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from: provider.from,
            to: email,
            subject: `Sign in to ${host}`,
            html: html({ linkUrl, host, theme }),
            text: text({ url, host }),
        }),
    })

    if (!res.ok) throw new Error("Resend error: " + JSON.stringify(await res.json()))
}

function html(params: { linkUrl: string; host: string; theme: Theme }) {
    const { linkUrl, host, theme } = params

    const escapedHost = host.replace(/\./g, "&#8203;.")

    const brandColor = theme.brandColor || "#346df1"
    const color = {
        background: "#f9f9f9",
        text: "#444",
        mainBackground: "#fff",
        buttonBackground: brandColor,
        buttonBorder: brandColor,
        buttonText: theme.buttonText || "#fff",
    }

    return `
    <body style="background: ${color.background};">
    <table width="100%" border="0" cellspacing="20" cellpadding="0"
        style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
        <tr>
        <td align="center"
            style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
            <strong>${escapedHost}</strong>に本登録する
        </td>
        </tr>
        <tr>
        <td align="center" style="padding: 20px 0;">
            <table border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}">
                        <a href="${linkUrl}"
                            target="_blank"
                            style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">
                                ユーザー登録する
                        </a>
                    </td>
                </tr>
                <tr>
                    クリックできない場合：${linkUrl}
                </tr>
            </table>
        </td>
        </tr>
        <tr>
        <td align="center"
            style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
            If you did not request this email you can safely ignore it.
        </td>
        </tr>
    </table>
    </body>
    `
}

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
function text({ url, host }: { url: string; host: string }) {
    return `Sign in to ${host}\n${url}\n\n`
}