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
        throw { code: "MISSING_CREDENTIALS", message: "Credentials are missing" };
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

        if (typeof res.data === "string" && res.data.includes("<title>Graphic Era")) {
            throw { code: "INVALID_SESSION", message: "Invalid session or redirected to login page" };
        }

        return res.data;
    } catch (err: any) {
        if (axios.isAxiosError(err)) {
            throw {
                code: err.code || "AXIOS_ERROR",
                message: err.message,
                status: err.response?.status || 500,
            };
        }
        throw { code: "UNKNOWN_ERROR", message: err?.message || "Unexpected error" };
    }
};
