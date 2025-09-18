import { create } from "zustand";
import Cookies from "js-cookie";

const BASE_URLS = {
  deemed: "https://student.geu.ac.in",
  hill: "https://student.gehu.ac.in",
} as const;

// keys of BASE_URLS → "deemed" | "hill"
type CampusKey = keyof typeof BASE_URLS;

interface CookieStore {
  campus: CampusKey;
  setCampus: (value: CampusKey) => void;
  getBaseUrl: () => string;
}

export const useCookieStore = create<CookieStore>((set, get) => ({
  campus: (Cookies.get("campus") as CampusKey) ?? "deemed",

  setCampus: (value) => {
    Cookies.set("campus", value, {
      expires: 365,
      path: "/",
      sameSite: "strict",
    });
    set({ campus: value });
  },

  getBaseUrl: () => {
    const c = get().campus;
    return BASE_URLS[c] || BASE_URLS.deemed;
  },
}));
