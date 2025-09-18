import { fetchGEU } from "@/lib/geuApi";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    try {
        const response = await fetchGEU("/Account/StudentIDCardPrint", req, {
            method: "post",
        })
        const jsonData = JSON.parse(response);
        return NextResponse.json(jsonData[0], {status: 200});
    } catch (error : any) {
        return NextResponse.json(
            {message: "Failed to featch profile image"},
            {status: error?.response?.status || 500}
        )
    }
}