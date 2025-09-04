// lib/cookies.ts
import { NextResponse } from "next/server";

export const setCookies = (res: NextResponse, cookies: string[]) => {
  cookies.forEach((cookieStr) => {
    const [pair] = cookieStr.split(";");
    const [key, value] = pair.split("=");

    res.cookies.set(key, value, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
  });
};
