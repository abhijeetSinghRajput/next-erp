// store/useAuthStore.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
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
  error: {
    checkAuth: string | null;
    getCaptcha: string | null;
    login: string | null;
    logout: string | null;
  };

  checkAuth: () => Promise<void>;
  getCaptcha: () => Promise<void>;
  login: (data: any) => Promise<boolean>;
  logout: () => Promise<void>;
}

// ✅ Centralized Error Handler
const handleAxiosError = (error: any, defaultMessage: string) => {
  const message =
    error?.response?.data?.message ||
    error?.message ||
    defaultMessage ||
    "An unexpected error occurred";
  toast.error(message);
  console.error("❌ Axios Error:", error);
  return message;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      authUser: null,
      captchaImage: null,
      formToken: "",
      loadingCaptcha: false,
      loggingIn: false,
      checkingAuth: false,
      authenticated: false,
      loginingOut: false,
      error: {
        checkAuth: null,
        getCaptcha: null,
        login: null,
        logout: null,
      },

      checkAuth: async () => {
        set({ checkingAuth: true });
        try {
          const res = await axiosInstance.get("/auth/check-auth");
          if (res?.data?.authenticated === undefined) {
            throw new Error("Invalid auth response");
          }
          set({
            authenticated: res.data.authenticated,
            error: { ...get().error, checkAuth: null },
          });
        } catch (error) {
          // const msg = handleAxiosError(error, "Failed to verify session");
          // set({
          //   error: { ...get().error, checkAuth: msg },
          // });
        } finally {
          set({ checkingAuth: false });
        }
      },

      getCaptcha: async () => {
        set({ loadingCaptcha: true });
        try {
          const res = await axiosInstance.get("/auth/captcha");
          const { image, formToken } = res.data;
          set({
            captchaImage: image,
            formToken,
            error: { ...get().error, getCaptcha: null },
          });
        } catch (error: any) {
          const msg = handleAxiosError(error, "Faild to load captcha");
          set({
            captchaImage: null,
            formToken: "",
            error: { ...get().error, getCaptcha: msg },
          });
        } finally {
          set({ loadingCaptcha: false });
        }
      },

      login: async (data) => {
        set({ loggingIn: true });
        const { formToken } = get();
        try {
          await axiosInstance.post("/auth/login", { ...data, formToken });
          set({
            authenticated: true,
            error: { ...get().error, login: null },
          });
          toast.success("Login Successful");

          const { fetchProfile } = useStudentStore.getState();
          await fetchProfile();

          return true;
        } catch (error: any) {
          const msg = handleAxiosError(error, "Login failed");
          set({
            authUser: null,
            authenticated: false,
            error: { ...get().error, login: msg },
          });
          get().getCaptcha();
          return false;
        } finally {
          set({ loggingIn: false });
        }
      },

      logout: async () => {
        set({ loginingOut: true });
        try {
          await axiosInstance.post("/auth/logout");
          set({
            authenticated: false,
            authUser: null,
            error: { ...get().error, logout: null },
          });
        } catch (error: any) {
          const msg = handleAxiosError(error, "Failed to logout");
          set({ error: { ...get().error, logout: msg } });
        } finally {
          set({ loginingOut: false });
        }
      },
    }),
    {
      name: "auth-storage", // name of the item in localStorage
      partialize: (state) => ({
        authenticated: state.authenticated,
        // Add any other state you want to persist
      }),
    }
  )
);
