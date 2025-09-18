// app/api/exam/admitcards/[examType]/route.ts
import { fetchGEU } from "@/lib/geuApi";
import { NextRequest, NextResponse } from "next/server";

const examTypes: Record<string, string> = {
  sessional: "1",
  endTerm: "2",
  midTerm: "3",
};

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ examType: string }> }
) {
  try {
    const { examType } = await context.params;

    if (!examType || !(examType in examTypes)) {
      return NextResponse.json(
        { message: "Invalid examType parameter" },
        { status: 400 }
      );
    }

    const payload = {
      ExamType: 1,
      MarksType: examTypes[examType],
      BackSetting: -1,
    };

    const response = await fetchGEU(
      "/Web_Exam/GetAdmitCardSlctStudentRecord",
      req,
      {
        method: "post",
        data: payload,
        customHeaders: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const parsed = JSON.parse(response?.state || "[]");
    const admitCard = Array.isArray(parsed) && parsed.length ? parsed[0] : null;

    return NextResponse.json({ admitCard });
  } catch (error: any) {
    console.error("getAdmitCard error:", error);
    return NextResponse.json(
      { message: "Failed to fetch admit card" },
      { status: error.status || 500 }
    );
  }
}
