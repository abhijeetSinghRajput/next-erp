import { errorMap } from "@/constants/errors";
import { extractLoginError } from "@/lib/errors";
import { setCookies } from "@/lib/cookies";
import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import { NextRequest, NextResponse } from "next/server";

interface LoginFormData {
  studentId: string;
  password: string;
  captcha: string;
  formToken: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: LoginFormData = await req.json();
    const { studentId, password, captcha, formToken } = body;

    const sessionId = req.cookies.get("ASP.NET_SessionId")?.value;
    const cookieToken =
      req.cookies.get("__RequestVerificationToken")?.value;

    const BASE_URL = req.headers.get("x-base-url");

    // ✔ Same validation as Node.js version
    if (
      !studentId ||
      !password ||
      !captcha ||
      !formToken ||
      !sessionId ||
      !cookieToken
    ) {
      return NextResponse.json(
        { message: "Missing credentials or tokens" },
        { status: 400 }
      );
    }

    // ✔ Prepare form data (same as Node.js)
    const formData = new URLSearchParams();
    formData.append("hdnMsg", "GEU");
    formData.append("checkOnline", "0");
    formData.append("__RequestVerificationToken", formToken);
    formData.append("UserName", studentId);
    formData.append("Password", password);
    formData.append("clientIP", "");
    formData.append("captcha", captcha);

    // ✔ Prepare axios with cookies
    const jar = new CookieJar();
    const client = wrapper(
      axios.create({
        jar,
        withCredentials: true,
      })
    );

    if (!BASE_URL) {
      return NextResponse.json(
        { message: "Missing x-base-url header" },
        { status: 400 }
      );
    }

    // ✔ Send login request
    const response = await client.post(BASE_URL, formData, {
      maxRedirects: 0,
      validateStatus: (status) => status >= 200 && status < 400,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Referer: BASE_URL,
        Origin: BASE_URL,
        Cookie: `ASP.NET_SessionId=${sessionId}; __RequestVerificationToken=${cookieToken}`,
      },
    });

    // ✔ Check success (same as Node.js)
    const isSuccess =
      response.status === 302 &&
      response.headers.location === "/Account/Cyborg_StudentMenu";

    if (!isSuccess) {
      const errorMsg = extractLoginError(response.data);
      return NextResponse.json({ message: errorMsg }, { status: 401 });
    }

    // ✔ Set cookies on client
    const setCookiesHeader = response.headers["set-cookie"] || [];
    const nextRes = NextResponse.json({ message: "✅ Login successful" });

    // Uses your custom cookie setter
    setCookies(nextRes, setCookiesHeader);

    return nextRes;
  } catch (error: any) {
    return NextResponse.json(
      {
        message:
          errorMap[error?.code] ||
          "Something went wrong during login",
      },
      { status: 500 }
    );
  }
}
