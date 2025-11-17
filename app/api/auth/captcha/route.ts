import { NextRequest, NextResponse } from "next/server";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";
import axios from "axios";
import { load } from "cheerio";
import { setCookies } from "@/lib/cookies";

export async function GET(req: NextRequest) {
  try {
    const BASE_URL = req.headers.get("x-base-url");

    if (!BASE_URL) {
      return NextResponse.json(
        { message: "Missing x-base-url header" },
        { status: 400 }
      );
    }

    const jar = new CookieJar();

    const client = wrapper(
      axios.create({
        jar,
        withCredentials: true,
      })
    );

    // STEP 1 — Load login page (sets cookies + has form token)
    const initialResponse = await client.get(BASE_URL);

    const $ = load(initialResponse.data);
    const token = $('input[name="__RequestVerificationToken"]').attr("value");

    if (!token) {
      return NextResponse.json(
        { message: "Token not found on login page" },
        { status: 500 }
      );
    }

    // STEP 2 — POST to CAPTCHA endpoint (same as your Express code)
    const captchaResponse = await client.post(
      `${BASE_URL}/Account/showcaptchaImage`,
      {},
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "RequestVerificationToken": token,
        },
      }
    );

    // STEP 3 — Convert binary buffer → base64
    const base64Image = Buffer.from(captchaResponse.data).toString("base64");

    // STEP 4 — Set cookies in Next.js response
    const cookies = await jar.getCookies(BASE_URL);
    const response = NextResponse.json({
      formToken: token,
      image: `data:image/png;base64,${base64Image}`,
    });

    setCookies(
      response,
      cookies.map((c) => c.cookieString())
    );

    return response;
  } catch (err: any) {
    console.error("Captcha error:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
