import { fetchUsers } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse>
{
    const users = await fetchUsers() 
    const res = NextResponse.json(users)

    return res
}