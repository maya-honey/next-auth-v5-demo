"use server"
import { PrismaClient } from "@prisma/client"
import { fetchUserByEmail, fetchVerificationTokeByEmail } from "@/lib/data"
import bcrypt from "bcryptjs"
const prisma = new PrismaClient()

export const newVerification = async (token: string) => {
    const existingToken = await fetchVerificationTokeByEmail(token)

    if (!existingToken) return {error: 'token does not exist!'}

    const hasExpired = new Date(existingToken.expires) < new Date()
    if (hasExpired) return {error: 'token has expired!'}

    const existingUser = await fetchUserByEmail(existingToken.identifier)

    if (!existingUser) return {error: 'user does not exist!'}

    const hashedPassword = await bcrypt.hash("password", 10)

    await prisma.user.update({
        where: {
            email: existingUser.email,
        },
        data: {
            emailVerified: new Date(),
            email: existingToken.identifier,
            password: hashedPassword,
        }
    })

    await prisma.user.delete({
        where: {
            email: existingToken.identifier,
        }
    })

    return { success: "Email Verified"}
}