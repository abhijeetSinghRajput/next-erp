import { errorMap } from "@/constants/errors";
import { fetchGEU } from "@/lib/geuApi";
import { NextRequest, NextResponse as res } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const data = await fetchGEU("/Web_Teaching/GetCircularDetails", req, {
            method: "post",
            referer: "https://student.geu.ac.in/Web_StudentAcademic/Cyborg_studentCircular?id=Circular/Notice"
        });

        const circulars = JSON.parse(data.state);

        return res.json({
            success: true,
            count: circulars.length,
            circulars,
        });
    } catch (error: any) {
        return res.json(
            { message: errorMap[error.code] || "Failed to fetch circular", },
            { status: error.status || 500 });
    }
};