import { errorMap } from "@/constants/errors";
import { fetchGEU } from "@/lib/geuApi";
import { NextRequest, NextResponse as res } from "next/server";
import qs from "qs";

export async function GET(req: NextRequest) {
    const feeType = req.nextUrl.searchParams.get("feeType") || 2;
    const duration = req.nextUrl.searchParams.get("duration") || 0;

    try {
        const payload = qs.stringify({ FeeType: feeType, duration });

        const response = await fetchGEU("/Web_StudentFinance/FillHead", req, {
            method: "POST",
            data: { FeeType: feeType, duration }, 
            customHeaders: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "X-Requested-With": "XMLHttpRequest",
            },
        });

        const feeSubmissions = {
            ...response,
            headdata: JSON.parse(response.headdata),
            headdatahostel: JSON.parse(response.headdatahostel),
        };
        return res.json(
            { feeSubmissions },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error fetching fee submission:", error);
        return res
            .json(
                { message: errorMap[error.code] || "Failed to fetch fee data" },
                { status: 500 }
            );
    }
};