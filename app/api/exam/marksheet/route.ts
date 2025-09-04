import { errorMap } from "@/constants/errors";
import { fetchGEU } from "@/lib/geuApi";
import { NextRequest, NextResponse as res } from "next/server";

export async function GET(req: NextRequest) {
    const yearSem = req.nextUrl.searchParams.get("yearSem");
    console.log(yearSem);
    
    try {
        const response = await fetchGEU("/Web_StudentAcademic/FillMarksheet", req, {
            method: "post",
            customHeaders: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            data: { yearSem },
        });

        const { docNo } = response;

        // Step 2: fetch PDF binary using docNo
        const pdfResponse = await fetchGEU(
            `/Web_StudentAcademic/DownloadFile?docNo=${docNo}`,
            req,
            {
                method: "get",
                responseType: "arraybuffer", // raw bytes
                customHeaders: {
                    Accept: "application/pdf",
                },
            }
        );

        // Step 3: stream it to client
        return new res(Buffer.from(pdfResponse), {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="marksheet_${yearSem}.pdf"`,
            },
        });
    } catch (error: any) {
        // console.error("Error fetching exam details:", error);
        return res.json(
            { message: errorMap[error.code] || "Internal Server Error" },
            { status: error.status || 500 },
        );
    }
};