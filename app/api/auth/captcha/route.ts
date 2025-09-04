import { NextRequest, NextResponse } from "next/server";
import { getCaptcha } from "@/controllers/auth"
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";
import axios from "axios";
import { load } from "cheerio";
import { errorMap } from "@/constants/errors";
import { setCookies } from "@/lib/cookies";


export async function GET(req: NextRequest) {
    try {
        const jar = new CookieJar();
        const client = wrapper(
            axios.create({
                jar,
                withCredentials: true,
            })
        );
        // Step 1: Get initial page to establish session and get tokens
        const initialResponse = await client.get("https://student.geu.ac.in/");

        // Parse the HTML to get the form's verification token
        const $ = load(initialResponse.data);
        const formToken = $('input[name="__RequestVerificationToken"]').val() as string | undefined;

        // Step 2: Get captcha as JSON array
        const captchaUrl = $("#imgPhoto").attr("src");
        if (!captchaUrl) {
            return NextResponse.json(
                { message: "Captcha image not found" },
                { status: 200 }
            );
        }

        // Step 6: Set cookies for frontend
        const cookies = await jar.getCookies("https://student.geu.ac.in/");
        const response = NextResponse.json({ image: captchaUrl, formToken });
        setCookies(response, cookies.map(cookie => cookie.cookieString()));

        return response;
    } catch (error: any) {
        // console.log(error);
        return NextResponse.json(
            { message: errorMap[error?.code as string] || "Something went wrong" },
            { status: 500 }
        );
    }
}