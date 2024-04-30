import { PrismaClient, User, Admin, VerificationToken } from "@prisma/client"

const prisma = new PrismaClient()

export async function fetchUsers() {
    const users = await prisma.user.findMany()

    return users
}

export async function fetchUserByEmail(email:string): Promise<User | null>{
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    })
    return user
}

export async function fetchAdminByEmail(email:string): Promise<Admin | null>{
    const user = await prisma.admin.findUnique({
        where: {
            email: email
        }
    })
    return user
}

export async function createUser(name:string, email:string, password:string): Promise<User>
{
    return await prisma.user.create({
        data: {
            name: name,
            email: email,
            password: password
        }
    })
}

export async function createAdmin(name:string, email:string, role: number, password:string): Promise<User>
{
    return await prisma.admin.create({
        data: {
            name: name,
            email: email,
            role: role,
            password: password
        }
    })
}

export async function fetchVerificationTokeByToken(token: string): Promise<VerificationToken | null>
{
    return await prisma.verificationToken.findFirst({
        where: {
            token: token,
        }
    })
}