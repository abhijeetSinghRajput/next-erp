import axios, { AxiosRequestConfig, Method } from "axios";
import { NextRequest } from "next/server";
import qs from "qs";

interface FetchOptions {
    method?: Method;
    data?: Record<string, any> | string;
    customHeaders?: Record<string, any>;
    referer?: string;
    responseType?: AxiosRequestConfig["responseType"];
}

export const fetchGEU = async (
    endpoint: string,
    req: NextRequest,
    options: FetchOptions = {}
) => {
    const sessionId = req.cookies.get("ASP.NET_SessionId")?.value;
    const token = req.cookies.get("__RequestVerificationToken")?.value;
    if (!sessionId || !token) {
        throw new Error("Credentials are missing");
    }
    const {
        method = "get",
        data = {},
        customHeaders = {},
        referer = "https://student.geu.ac.in",
        responseType = "json",
    } = options;

    const url = `https://student.geu.ac.in${endpoint}`;

    const isFormEncoded =
        customHeaders["Content-Type"] === "application/x-www-form-urlencoded";

    const defaultHeaders = {
        "Content-Type": isFormEncoded
            ? "application/x-www-form-urlencoded"
            : "application/json",
        "X-Requested-With": "XMLHttpRequest",
        Origin: "https://student.geu.ac.in",
        Referer: referer,
        Cookie: `ASP.NET_SessionId=${sessionId}; __RequestVerificationToken=${token}`,
        ...customHeaders,
    };

    try {
        const res = await axios({
            method,
            url,
            headers: defaultHeaders,
            data:
                method === "post" && data
                    ? isFormEncoded
                        ? qs.stringify(data)
                        : data
                    : undefined,
            responseType,
        });

        // Check for unexpected login redirect
        if (
            typeof res.data === "string" &&
            res.data.includes("<title>Graphic Era")
        ) {
            throw new Error("❌ Invalid session or redirected to login page.");
        }

        return res.data;
    } catch (error) {
        console.error(`❌ Error fetching from ${endpoint}:`, error);
        throw error;
    }
};
