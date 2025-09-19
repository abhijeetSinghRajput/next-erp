import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.cookies.get("ASP.NET_SessionId")?.value;
    const token = req.cookies.get("__RequestVerificationToken")?.value;
    const BASE_URL = req.headers.get("x-base-url");

    if (!sessionId || !token) {
      return NextResponse.json(
        { message: "Authentication cookies missing" },
        { status: 401 }
      );
    }

    const imageResponse = await axios.get(`${BASE_URL}/Account/show`, {
      headers: {
        Cookie: `ASP.NET_SessionId=${sessionId}; __RequestVerificationToken=${token}`,
        Referer: BASE_URL,
      },
      responseType: "arraybuffer",
      withCredentials: true,
    });

    if (!imageResponse.data || imageResponse.data.length === 0) {
      return NextResponse.json(
        { message: "No image data received" },
        { status: 404 }
      );
    }

    // Return raw image data with correct headers
    return new NextResponse(imageResponse.data, {
      status: 200,
      headers: {
        "Content-Type": imageResponse.headers["content-type"] || "image/png",
        "Content-Length": imageResponse.headers["content-length"],
      },
    });
  } catch (error: any) {
    console.error("Error fetching profile image:", error);
    return NextResponse.json(
      { message: "Failed to fetch profile image" },
      { status: error?.response?.status || 500 }
    );
  }
}
