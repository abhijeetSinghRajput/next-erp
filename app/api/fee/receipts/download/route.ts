import { errorMap } from "@/constants/errors";
import { fetchGEU } from "@/lib/geuApi";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const ReceiptModeID = req.nextUrl.searchParams.get("ReceiptModeID");
    const BookID = req.nextUrl.searchParams.get("BookID");
    const CombineReceiptNo = req.nextUrl.searchParams.get("CombineReceiptNo");

    if (!ReceiptModeID || !BookID || !CombineReceiptNo) {
        return NextResponse.json(
            { message: "Missing required parameters: ReceiptModeID, BookID, CombineReceiptNo" },
            { status: 400 }
        );
    }

    try {
        // 1️⃣ Get ReceiptNo from ERP
        const ReceiptNo = await fetchGEU(
            `/Web_StudentFinance/ShowFeeReceipt_ostulgn`,
            req,
            {
                method: "post",
                data: { ReceiptModeID, BookID, CombineReceiptNo },
                customHeaders: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        if (!ReceiptNo) {
            return NextResponse.json(
                { message: "ReceiptNo not found" },
                { status: 400 }
            );
        }

        // 2️⃣ Download PDF as arraybuffer
        const pdfResponse = await axios.get(
            `https://student.geu.ac.in/Web_StudentFinance/DownloadFile?ReceiptNo=${ReceiptNo}`,
            {
                responseType: "arraybuffer",
                headers: {
                    Cookie: req.headers.get("cookie") || "",
                },
            }
        );

        // 3️⃣ Return PDF with proper headers
        const encodedFilename = encodeURIComponent(`${ReceiptNo}-fee-receipt.pdf`);
        
        return new NextResponse(pdfResponse.data, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename=${encodedFilename}`,
                "Content-Length": pdfResponse.data.length.toString(),
            },
        });
    } catch (error: any) {
        console.error(
            "Error downloading receipt:",
            errorMap[error.code],
            error.message
        );
        return NextResponse.json(
            { message: errorMap[error.code] || "Failed to download receipt" },
            { status: error.status || 500 }
        );
    }
}