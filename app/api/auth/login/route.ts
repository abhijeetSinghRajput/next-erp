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
    const cookieToken = req.cookies.get("__RequestVerificationToken")?.value;
    const BASE_URL = req.headers.get("x-base-url");

    // ✅ Validation
    if (
      !studentId ||
      !password ||
      !captcha ||
      !formToken ||
      !sessionId ||
      !cookieToken ||
      !BASE_URL
    ) {
      return NextResponse.json(
        { message: "Missing credentials or tokens" },
        { status: 400 }
      );
    }

    // ✅ Prepare form data
    const formData = new URLSearchParams();
    formData.append("hdnMsg", "GEU");
    formData.append("checkOnline", "0");
    formData.append("__RequestVerificationToken", formToken);
    formData.append("UserName", studentId);
    formData.append("Password", password);
    formData.append("clientIP", "");
    formData.append("captcha", captcha);

    // ✅ Send login request WITHOUT jar (plain axios)
    const response = await axios.post(BASE_URL, formData.toString(), {
      maxRedirects: 0,
      validateStatus: (status) => status >= 200 && status < 400,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Referer": BASE_URL,
        "Origin": BASE_URL,
        "Cookie": `ASP.NET_SessionId=${sessionId}; __RequestVerificationToken=${cookieToken}`,
      },
    });

    const redirectLocation = response.headers.location || response.headers.Location;
    const setCookiesHeader = response.headers["set-cookie"] || [];

    console.log({
      status: response.status,
      location: redirectLocation,
      hasCookies: setCookiesHeader.length > 0,
    });

    // ✅ Check success: 302 redirect + new cookies + not redirecting to login
    const isSuccess =
      response.status === 302 &&
      setCookiesHeader.length > 0 &&
      redirectLocation &&
      redirectLocation !== "/" &&
      !redirectLocation.toLowerCase().includes("login");

    if (!isSuccess) {
      const errorMsg = extractLoginError(response.data);
      return NextResponse.json(
        { message: errorMsg || "Invalid credentials or captcha" },
        { status: 401 }
      );
    }

    // ✅ Set new authentication cookies on client
    const nextRes = NextResponse.json({
      message: "✅ Login successful",
      redirectTo: redirectLocation,
    });

    setCookies(nextRes, setCookiesHeader);

    return nextRes;
  } catch (error: any) {
    console.error("Login error:", error.message);
    return NextResponse.json(
      {
        message:
          errorMap[error?.code] || "Something went wrong during login",
      },
      { status: error.response?.status || 500 }
    );
  }
}