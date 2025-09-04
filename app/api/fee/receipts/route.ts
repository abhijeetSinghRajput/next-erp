import { errorMap } from "@/constants/errors";
import { fetchGEU } from "@/lib/geuApi";
import { NextRequest, NextResponse as res } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const response = await fetchGEU(
            "/Web_StudentFinance/GetStudentFeeReceipt_ostulgn",
            req,
            {
                method: "POST",
            }
        );

        const feeReceipts = JSON.parse(response);

        return res.json(
            { feeReceipts },
            { status: 200 },
        );
    } catch (error: any) {
        console.error("Error fetching fee receipts:", error);
        return res.json(
            { message: errorMap[error.code] || "Failed to fetch fee receipt data" },
            { status: error.status || 500 },
        );
    }
};