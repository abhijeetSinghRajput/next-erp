import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const sessionId = req.cookies.get("ASP.NET_SessionId")?.value;
  const cookieToken = req.cookies.get("__RequestVerificationToken")?.value;

  if (!sessionId || !cookieToken) {
    return NextResponse.json({ message: "Session is missing" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
    matcher: [
      "/api/profile/:path*",
      "/api/attendance/:path*",
      "/api/circular/:path*",
      "/api/exam/:path*",
      "/api/fee/:path*",
    ],
  };

