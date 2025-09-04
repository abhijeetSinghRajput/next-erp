// store/useAuthStore.ts
"use client";

import { create } from "zustand";
import { toast } from "sonner";
import { useStudentStore } from "./useStudentStore";
import { axiosInstance } from "@/lib/axios";

export interface AuthState {
  authUser: any;
  captchaImage: string | null;
  formToken: string;
  loadingCaptcha: boolean;
  loggingIn: boolean;
  checkingAuth: boolean;
  authenticated: boolean;
  loginingOut: boolean;

  checkAuth: () => Promise<void>;
  getCaptcha: () => Promise<void>;
  login: (data: any) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  authUser: null,
  captchaImage: null,
  formToken: "",
  loadingCaptcha: false,
  loggingIn: false,
  checkingAuth: false,
  authenticated: false,
  loginingOut: false,

  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/check-auth");
      const { authenticated } = res.data;
      set({ authenticated });
    } catch {
      set({ authenticated: false });
    } finally {
      set({ checkingAuth: false });
    }
  },

  getCaptcha: async () => {
    set({ loadingCaptcha: true });
    try {
      const res = await axiosInstance.get("/auth/captcha");
      const { image, formToken } = res.data;
      set({ captchaImage: image, formToken });
    } catch (error: any) {
      console.error("Error fetching captcha:", error);
      toast.error(error?.response?.data?.message || "Failed to load captcha");
      set({ captchaImage: null, formToken: "" });
    } finally {
      set({ loadingCaptcha: false });
    }
  },

  login: async (data) => {
    set({ loggingIn: true });
    const { formToken } = get();
    try {
      await axiosInstance.post("/auth/login", { ...data, formToken });
      set({ authenticated: true });
      toast.success("Login Successful");

      const { fetchProfile } = useStudentStore.getState();
      await fetchProfile();

      return true;
    } catch (error: any) {
      console.error("Login error:", error);
      set({ authUser: null, authenticated: false });
      toast.error(error?.response?.data?.message || "Something went wrong");
      return false;
    } finally {
      set({ loggingIn: false });
    }
  },

  logout: async () => {
    set({ loginingOut: true });
    try {
      await axiosInstance.post("/auth/logout");
      set({ authenticated: false });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to logout");
    } finally {
      set({ loginingOut: false });
    }
  },
}));
