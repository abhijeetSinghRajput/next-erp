export const errorMap: Record<string, string> = {
    // 🔌 Network / System errors
    ETIMEDOUT: "⏳ Timeout: The server took too long to respond.",
    ECONNREFUSED: "🚫 Connection refused: Unable to reach the server.",
    ECONNRESET: "🔄 Connection reset: Unexpected socket closure.",
    ENOTFOUND: "🌐 Host not found: Invalid server address.",
    EAI_AGAIN: "🔁 DNS Lookup failed: Try again shortly.",
    EADDRINUSE: "⚠️ Port conflict detected.",
    EPIPE: "🧯 Broken pipe: Socket write failure.",
    ENETUNREACH: "📡 Network unreachable: Check your connection.",
    EHOSTUNREACH: "🚫 Host unreachable: Server might be offline.",
    EPROTO: "🔐 Protocol error: SSL/TLS issue.",
    ECONNABORTED: "⛔ Connection aborted: Likely timeout.",

    // 🎓 GEU-specific / Custom errors
    MISSING_CREDENTIALS: "🔑 Missing session credentials. Please log in again.",
    INVALID_SESSION: "🚷 Invalid session: Your login expired, please re-authenticate.",
    AXIOS_ERROR: "⚠️ Unexpected network error occurred.",
    UNKNOWN_ERROR: "❓ An unknown error occurred. Please try again.",
};
