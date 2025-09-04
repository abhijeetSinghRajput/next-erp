import { errorMap } from "@/constants/errors";
import { fetchGEU } from "@/lib/geuApi";
import { NextRequest, NextResponse } from "next/server";

interface LoginFormData {
  RegID: number;
  PeriodAssignID: number;
  TTID: number;
  LectureTypeID: number;
  DateFrom: string; // send as string, Date objects won’t serialize
  DateTo: string;
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ subjectId: string }> }
) {
  const { subjectId } = await context.params; 
  const body: LoginFormData = await req.json();

  if (!subjectId) {
    return NextResponse.json(
      { message: "subjectId required" },
      { status: 400 }
    );
  }

  const payload = {
    SubjectID: subjectId,
    RegID: body.RegID || 0,
    PeriodAssignID: body.PeriodAssignID,
    TTID: body.TTID,
    LectureTypeID: body.LectureTypeID,
    DateFrom: body.DateFrom,
    DateTo: body.DateTo,
  };

  try {
    const result = await fetchGEU(
      "/Web_StudentAcademic/FillAttendanceDetail_ostulgn",
      req,
      {
        method: "post",
        customHeaders: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        data: payload, // ✅ let fetchGEU handle qs.stringify
      }
    );

    const state = JSON.parse(result.state || "[]");
    const data = JSON.parse(result.data || "[]")[0] || {};
    const dtLecture = JSON.parse(result.dtLecture || "[]");

    return NextResponse.json(
      { state, data, dtLecture },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message:
          errorMap[error.code] ||
          "Failed to fetch attendance details by subject",
      },
      { status: error.status || 500 }
    );
  }
}
