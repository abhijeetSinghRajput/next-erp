import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const campus = req.cookies.get("campus")?.value;
  const baseUrl =
    campus === "hill"
      ? "https://student.gehu.ac.in/"
      : "https://student.geu.ac.in/";

  console.log({campus});
  const res = NextResponse.next();
  res.cookies.set("x-base-url", baseUrl);
  return res;
}

export const config = {
  matcher: [
    "/api/attendance/:path*",
    "/api/auth/:path*",
    "/api/circular/:path*",
    "/api/exam/:path*",
    "/api/fee/:path*",
    "/api/profile/:path*",
  ],
};
