import { errorMap } from "@/constants/errors";
import { fetchGEU } from "@/lib/geuApi";
import { NextRequest, NextResponse as res } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const data = await fetchGEU("/Account/GetCircularIntention", req, {
            method: "post",
        });
        return res.json({
            ...data,
            circular: JSON.parse(data.circular)
        });
    } catch (error: any) {
        return res.json(
            { message: errorMap[error.code] || "Failed to fetch All circulars", },
            { status: error.status || 500 });
    }
};
