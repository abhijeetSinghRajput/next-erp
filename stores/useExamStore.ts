import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";
import type { AxiosError } from "axios";

// Type definitions for exam data
export interface ExamSummaryItem {
  YearSem: string;
  Result: "Pass" | "Fail";
  TotalSubject: number;
  TotalBack: number;
  percnt: number;
  Marks: string;
  CGPA?: string;
}

export interface BacklogItem {
  SubjectCode: string;
  Subject: string;
  YearSem: string;
  YS?: string;
}

interface ExamState {
  examSummary: ExamSummaryItem[];
  backlogs: BacklogItem[];
  loadingExamSummary: boolean;
  loadingMarksheet: string | null;
  errors: {
    getExamSummary: string | null;
    getBacklogs: string | null;
    downloadMarksheet: string | null;
  };

  getExamSummary: () => Promise<void>;
  getBacklogs: () => Promise<void>;
  downloadMarksheet: (yearSem: string) => Promise<void>;
}

export const useExamStore = create<ExamState>((set, get) => ({
  examSummary: [],
  backlogs: [],
  loadingExamSummary: false,
  loadingMarksheet: null,
  errors: {
    getExamSummary: null,
    getBacklogs: null,
    downloadMarksheet: null,
  },

  getExamSummary: async () => {
    set({
      loadingExamSummary: true,
      errors: { ...get().errors, getExamSummary: null },
    });
    try {
      const res = await axiosInstance.get("/exam/summary");
      console.log(res.data);
      set({ examSummary: res.data });
    } catch (error: unknown) {
      const axiosError = error as AxiosError<any> | undefined;
      const message =
        axiosError?.response?.data?.message ||
        "Something went wrong while fetching exam summary";
      set({ errors: { ...get().errors, getExamSummary: message } });
      toast.error(message);
    } finally {
      set({ loadingExamSummary: false });
    }
  },

  getBacklogs: async () => {
    set({
      errors: { ...get().errors, getBacklogs: null },
    });
    try {
      const res = await axiosInstance.get("/exam/backlogs");
      set({ backlogs: res.data });
    } catch (error: unknown) {
      const axiosError = error as AxiosError<any> | undefined;
      const message =
        axiosError?.response?.data?.message ||
        "Something went wrong while fetching backlogs";
      set({ errors: { ...get().errors, getBacklogs: message } });
      toast.error(message);
    }
  },

  downloadMarksheet: async (yearSem: string) => {
    set({ loadingMarksheet: yearSem });
    try {
      const response = await axiosInstance.get("/exam/marksheet", {
        params: { yearSem },
        responseType: "blob",
      });
      
      // Create blob URL and trigger download
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `marksheet-${yearSem}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("Marksheet downloaded successfully");
    } catch (error: unknown) {
      const axiosError = error as AxiosError<any> | undefined;
      const message =
        axiosError?.response?.data?.message ||
        "Something went wrong while downloading marksheet";
      set({ errors: { ...get().errors, downloadMarksheet: message } });
      toast.error(message);
    } finally {
      set({ loadingMarksheet: null });
    }
  },
}));
