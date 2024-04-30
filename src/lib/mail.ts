import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendVerificationEmail = async (
    email: string,
    token: string
) => {
    const confimLink = `http://localhost:3000/auth/new-verification?token=${token}`

    await resend.emails.send({
        from: process.env.RESEND_FROM!,
        to: email,
        subject: "confirm your email",
        html: `<p>Click <a href="${confimLink}">heare</a> to confirm email.</p>`
    })
}