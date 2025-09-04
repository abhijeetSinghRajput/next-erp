import { errorMap } from "@/constants/errors";
import { fetchGEU } from "@/lib/geuApi";
import { NextRequest, NextResponse as res } from "next/server";

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

        return res.json(
            { backlogs: parsed },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error fetching exam details:", error);
        return res
            .json(
                { message: errorMap[error.code] || "Internal Server Error" },
                { status: error.status || 500 }
            );
    }
};