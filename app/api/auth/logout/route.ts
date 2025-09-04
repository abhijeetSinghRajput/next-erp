import { NextRequest, NextResponse } from 'next/server';
import { fetchGEU } from '@/lib/geuApi';
import { errorMap } from '@/constants/errors';

export async function POST(req: NextRequest) {
    try {
        await fetchGEU("/Account/LogOff", req, {
            method: "post",
            data: {},
        });

        const response = NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
        
        response.cookies.delete("ASP.NET_SessionId");
        response.cookies.delete("__RequestVerificationToken");

        return response;
    } catch (error: any) {
        console.error("Logout error:", error);
        return NextResponse.json(
            { message: errorMap[error?.code as string] || "Failed to logout" }, 
            { status: 500 }
        );
    }
}