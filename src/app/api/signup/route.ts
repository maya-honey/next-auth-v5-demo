import { createUser, fetchUserByEmail, fetchUsers } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt'
import mailer from 'nodemailer'

export async function POST(req: NextRequest): Promise<NextResponse>
{
    const smtip = mailer.createTransport({
        host: 'mailhog', // メールサーバー
        port: 1025,
        secure: false, // 465 番ポートを使う場合。それ以外は false
        requireTLS: false,
        tls: {
        rejectUnauthorized: false,
        },
        auth: { // 認証情報
            user: 'user', // ユーザー名
            pass: 'password', // パスワード
        },
    })

    const mail = {
        from: 'demoauthapp@example.com', // 送信元メールアドレス
        to: 'rkinc.yoshida@gmail.com', // 送信先メールアドレス
        subject: '会員登録しました！',
        text: `登録成功`,
        html: `<p>登録成功</p>`,
    };

    
    try {
        const { name, email, password} = await req.json()
        
        if (!name || !email || !password) return NextResponse.json({error: '入力内容に不備があります'})
            
        const registeredUser = await fetchUserByEmail(email)
        if (registeredUser) return NextResponse.json({error: '既に登録されているメールアドレスです'})
            
        const hashedPassword = await bcrypt.hash(password, 10)
        
        const user = await createUser(name, email, hashedPassword)
            
        try {
            const result = await smtip.sendMail(mail);
            console.log('+++ Sent +++');
            console.log(result);
        } catch (err) {
            console.log('--- Error ---');
            console.log(err);
        }
        return NextResponse.json({user: user})
    } catch(err) {
        console.error(err)
        return NextResponse.json({error: 'Failed to create user', })
    }
}