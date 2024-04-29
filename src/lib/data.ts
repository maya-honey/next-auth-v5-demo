import { PrismaClient, User } from "@prisma/client"

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