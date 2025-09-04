import { errorMap } from "@/constants/errors";
import { fetchGEU } from "@/lib/geuApi";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const data = await fetchGEU("/Account/GetStudentDetail", req, {method: "post"});
        const student = JSON.parse(data.state)[0];
        return NextResponse.json(
            student,
            {status: 200}
        )
    } catch (error: any) {
        console.log(error);
        return NextResponse.json(
            { message: errorMap[error?.code as string] || "Something went wrong during fetching profile" },
            { status: 500 }
        );
    }
}