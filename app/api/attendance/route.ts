import { errorMap } from "@/constants/errors";
import { fetchGEU } from "@/lib/geuApi";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const RegID  = req.nextUrl.searchParams.get("RegID");
    if (!RegID) {
        return NextResponse.json(
            { message: "RegId required" },
            { status: 400 }
        );
    }
    try {
        const result = await fetchGEU("/Web_StudentAcademic/GetSubjectDetailStudentAcademicFromLive", req, {
            customHeaders: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            },
            data: { RegID },
        });

        const state = JSON.parse(result.state || "[]");
        const data = JSON.parse(result.data || "[]");

        return NextResponse.json(
            { state, data },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: errorMap[error.code] || "Failed to fetch attendance subjects" },
            { status: error.status || 500 }
        );
    }
}