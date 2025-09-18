// app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const DEEMED_BASE_URL = "https://student.geu.ac.in/";
const HILL_BASE_URL = "https://student.gehu.ac.in/";

export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Extract body + cookies
    const { studentId, email, DOB } = await req.json();
    const campus = req.cookies.get("campus")?.value || "deemed";

    const BASE_URL = campus === "hill" ? HILL_BASE_URL : DEEMED_BASE_URL;

    // 2️⃣ Build target URL for ERP
    const url = `${BASE_URL}Account/ResetPassword?ID=${encodeURIComponent(
      studentId
    )}&Mob=${encodeURIComponent(email)}&db=${encodeURIComponent(DOB)}`;

    // 3️⃣ Call ERP
    const response = await axios.get(url, {
      headers: {
        accept: "*/*",
        "user-agent": "Mozilla/5.0",       // mimic browser
        "x-requested-with": "XMLHttpRequest",
        referer: `${BASE_URL}Account/ForgotPassword`,
      },
      withCredentials: true,
    });

    return NextResponse.json({
      message: "success",
      result: response.data,
    });
  } catch (error: any) {
    console.error("Error resetting password:", error?.response?.data || error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error?.response?.status || error.message,
      },
      { status: error?.response?.status || 500 }
    );
  }
}
