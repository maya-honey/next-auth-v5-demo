import { createAdmin, fetchAdminByEmail } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest): Promise<NextResponse>
{
    
    try {
        const { name, email, role, password} = await req.json()
        
        if (!name || !email || !role || !password) return NextResponse.json({error: '入力内容に不備があります'})
            
        const registeredUser = await fetchAdminByEmail(email)
        if (registeredUser) return NextResponse.json({error: '既に登録されているメールアドレスです'})
            
        const hashedPassword = await bcrypt.hash(password, 10)
        
        const user = await createAdmin(name, email, role, hashedPassword)

        return NextResponse.json({user: user})
    } catch(err) {
        console.error(err)
        return NextResponse.json({error: 'Failed to create user', })
    }
}

