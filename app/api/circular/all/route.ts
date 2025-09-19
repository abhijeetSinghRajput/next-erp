import { errorMap } from "@/constants/errors";
import { fetchGEU } from "@/lib/geuApi";
import { NextRequest, NextResponse as res } from "next/server";

export async function GET(req: NextRequest) {
    try {
            const BASE_URL = req.headers.get("x-base-url");
        const data = await fetchGEU("/Web_Teaching/GetCircularDetails", req, {
            method: "post",
            referer: `{BASE_URL}/Web_StudentAcademic/Cyborg_studentCircular?id=Circular/Notice`
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