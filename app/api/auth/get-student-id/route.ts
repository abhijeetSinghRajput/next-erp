import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import qs from "qs";

const DEEMED_BASE_URL = "https://student.geu.ac.in/";
const HILL_BASE_URL = "https://student.gehu.ac.in/";

export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Parse body and cookies
    const { DOB, email } = await req.json();
    const campus = req.cookies.get("campus")?.value || "deemed";

    const BASE_URL = campus === "hill" ? HILL_BASE_URL : DEEMED_BASE_URL;

    // 2️⃣ Prepare form-urlencoded payload
    const payload = qs.stringify({
      db: DOB,
      Email: email,
    });

    // 3️⃣ Call ERP API
    const response = await axios.post(
      `${BASE_URL}Account/Getstudentid`,
      payload,
      {
        headers: {
          accept: "*/*",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "user-agent": "Mozilla/5.0",       
          "x-requested-with": "XMLHttpRequest",
          referer: `${BASE_URL}Account/ForgotID`,
        },
        withCredentials: true,
      }
    );

    return NextResponse.json({
      message: "success",
      result: response.data,
    });
  } catch (error: any) {
    console.error("Getstudentid error:", error?.response?.data || error.message);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error?.response?.status || error.message,
      },
      { status: error?.response?.status || 500 }
    );
  }
}
