// app/api/update-avatar/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import FormData from "form-data";

const DEEMED_BASE_URL = "https://student.geu.ac.in/";
const HILL_BASE_URL = "https://student.gehu.ac.in/";

export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Extract cookies & body
    const cookies = req.cookies;
    const sessionId = cookies.get("ASP.NET_SessionId")?.value;
    const token = cookies.get("__RequestVerificationToken")?.value;
    const campus = cookies.get("campus")?.value || "deemed";

    if (!sessionId || !token) {
      return NextResponse.json({ message: "Credentials are missing" }, { status: 400 });
    }

    const form = await req.formData();
    const file = form.get("file") as File;

    if (!file) {
      return NextResponse.json({ message: "No file uploaded." }, { status: 400 });
    }

    // 2️⃣ Build FormData to send to ERP server
    const extension = file.type === "image/png" ? "png" : "jpg";
    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadData = new FormData();
    uploadData.append("helpSectionImages", buffer, {
      filename: `avatar.${extension}`,
      contentType: file.type,
    });

    const BASE_URL = campus === "hill" ? HILL_BASE_URL : DEEMED_BASE_URL;

    // 3️⃣ POST to remote ERP
    const response = await axios.post(
      `${BASE_URL}Web_StudentAcademic/UploadStudentImg_ostulgn`,
      uploadData,
      {
        headers: {
          ...uploadData.getHeaders(),
          Cookie: `ASP.NET_SessionId=${sessionId}; __RequestVerificationToken=${token}`,
          Origin: BASE_URL,
          Referer: `${BASE_URL}Web_StudentAcademic/Cyborg_StudentLogin_DocumentUpload?id=Enrollment%20Form`,
          "X-Requested-With": "XMLHttpRequest",
        },
      }
    );

    return NextResponse.json({ success: true, data: response.data });
  } catch (error: any) {
    console.error("Error uploading avatar:", error?.response?.data || error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
