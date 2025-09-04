import { errorMap } from "@/constants/errors";
import { fetchGEU } from "@/lib/geuApi";
import { NextRequest, NextResponse as res } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const response = await fetchGEU(
            "/Web_StudentAcademic/GetStudentExamSummary",
            req,
            {
                method: "post",
            }
        );

        const examSummary = JSON.parse(response.ExamSummary);
        return res.json(examSummary , { status: 200 });
    } catch (error: any) {
        console.error("Error fetching exam summary:", error);
        return res
            .json(
                { message: errorMap[error.code] || "Internal Server Error" },
                { status: error.status || 500 }
            );
    }
};