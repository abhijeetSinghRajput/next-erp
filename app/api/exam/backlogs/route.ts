import { errorMap } from "@/constants/errors";
import { fetchGEU } from "@/lib/geuApi";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const response = await fetchGEU(
      "/Web_StudentAcademic/GetStudentBackPapers",
      req,
      {
        method: "post",
      }
    );
    const parsed = JSON.parse(response._backData);
    return NextResponse.json({ backlogs: parsed }, { status: 200 });
  } catch (error : any) {
    // console.log(error);
    return NextResponse.json(
      { message: errorMap[error?.code as string] || "Failed to load backlogs" },
      { status: 500 }
    );
  }
}
