import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { errorMap } from '@/constants/errors';

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.cookies.get("ASP.NET_SessionId")?.value;
    const token = req.cookies.get("__RequestVerificationToken")?.value;
    const BASE_URL = req.headers.get("x-base-url");

    if (!sessionId || !token) {
      return NextResponse.json({ message: "Session or token missing" }, { status: 401 });
    }

    const response = await axios.get(
      `${BASE_URL}/account/Cyborg_StudentMenu`,
      {
        headers: {
          Cookie: `ASP.NET_SessionId=${sessionId}; __RequestVerificationToken=${token}`,
        },
        maxRedirects: 0, // Don't follow redirect
        validateStatus: (status: number) => status === 200 || status === 302, // Accept both
      }
    );

    if (response.status === 200) {
      // ✅ Authenticated
      return NextResponse.json({ authenticated: true }, { status: 200 });
    } else if (response.status === 302) {
      // ❌ Unauthenticated
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ message: "Unexpected status" }, { status: 500 });
  } catch (error: any) {
    console.error("❌ Error checking auth:", error?.message);
    return NextResponse.json(
      { message: errorMap[error?.code as string] || "Internal error" }, 
      { status: 500 }
    );
  }
}