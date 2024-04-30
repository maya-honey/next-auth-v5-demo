import { createUser, fetchUserByEmail, fetchUsers } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs'
import { sendVerificationEmail } from "@/lib/mail";

export async function POST(req: NextRequest): Promise<NextResponse>
{
    
    try {
        const { name, email, password} = await req.json()
        
        if (!name || !email || !password) return NextResponse.json({error: '入力内容に不備があります'})
            
        const registeredUser = await fetchUserByEmail(email)
        if (registeredUser) return NextResponse.json({error: '既に登録されているメールアドレスです'})
            
        const hashedPassword = await bcrypt.hash(password, 10)
        
        const user = await createUser(name, email, hashedPassword)

        try {
            console.log('+++ Sent +++');
            await sendVerificationEmail(email, 'tokentokentoken')
        } catch (err) {
            console.log('--- Error ---');
            console.log('--- resend Error ---');
        }

        return NextResponse.json({user: user})
    } catch(err) {
        console.error(err)
        return NextResponse.json({error: 'Failed to create user', })
    }
}

