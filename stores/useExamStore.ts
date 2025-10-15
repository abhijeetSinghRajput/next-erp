import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";
import type { AxiosError } from "axios";

// ---------- Types ----------
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

export type ExamType = "sessional" | "endTerm" | "midTerm";

export interface AdmitCardData {
  YearSem: string;
  Caption: string;
  Course: string;
  [key: string]: any;
}

interface ExamState {
  examSummary: ExamSummaryItem[];
  backlogs: BacklogItem[];
  loadingBacklogs: boolean;
  loadingExamSummary: boolean;
  loadingMarksheet: string | null;
  loadingAdmitCard: ExamType | false;
  errors: {
    getExamSummary: string | null;
    getBacklogs: string | null;
    downloadMarksheet: string | null;
    getAdmitCard: string | null;
  };
  admitCards: Record<ExamType, AdmitCardData | null>;

  getExamSummary: () => Promise<void>;
  getBacklogs: () => Promise<void>;
  downloadMarksheet: (yearSem: string) => Promise<void>;
  getAdmitCard: (examType: ExamType) => Promise<void>;
}

// ---------- Store ----------
export const useExamStore = create<ExamState>((set, get) => ({
  examSummary: [],
  backlogs: [],
  loadingBacklogs: false,
  loadingExamSummary: false,
  loadingMarksheet: null,
  loadingAdmitCard: false,
  errors: {
    getExamSummary: null,
    getBacklogs: null,
    downloadMarksheet: null,
    getAdmitCard: null,
  },
  admitCards: {
    sessional: null,
    endTerm: null,
    midTerm: null,
  },

  getExamSummary: async () => {
    set({
      loadingExamSummary: true,
      errors: { ...get().errors, getExamSummary: null },
    });
    try {
      const res = await axiosInstance.get<ExamSummaryItem[]>("/exam/summary");
      set({ examSummary: res.data });
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const message =
        axiosError.response?.data?.message ??
        "Something went wrong while fetching exam summary";
      set({ errors: { ...get().errors, getExamSummary: message } });
      toast.error(message);
    } finally {
      set({ loadingExamSummary: false });
    }
  },

  getBacklogs: async () => {
    set({loadingBacklogs: true, errors: { ...get().errors, getBacklogs: null } });
    try {
      const res = await axiosInstance.get<BacklogItem[]>("/exam/backlogs");
      set({ backlogs: res.data });
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const message =
        axiosError.response?.data?.message ??
        "Something went wrong while fetching backlogs";
      set({ errors: { ...get().errors, getBacklogs: message } });
      toast.error(message);
    } finally{
      set({loadingBacklogs: false});
    }
  },

  downloadMarksheet: async (yearSem) => {
    set({ loadingMarksheet: yearSem });
    try {
      const res = await axiosInstance.get("/exam/marksheet", {
        params: { yearSem },
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `marksheet-${yearSem}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      toast.success("Marksheet downloading...");
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const message =
        axiosError.response?.data?.message ??
        "Something went wrong while downloading marksheet";
      set({ errors: { ...get().errors, downloadMarksheet: message } });
      toast.error(message);
    } finally {
      set({ loadingMarksheet: null });
    }
  },

  getAdmitCard: async (examType) => {
    set({
      loadingAdmitCard: examType,
      errors: { ...get().errors, getAdmitCard: null },
    });
    try {
      const res = await axiosInstance.get<{ admitCard: AdmitCardData }>(
        `/exam/admitcards/${examType}`
      );
      set({
        admitCards: { ...get().admitCards, [examType]: res.data.admitCard },
      });
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const message =
        axiosError.response?.data?.message ?? "Failed to fetch admit card";
      toast.error(message);
      set({ errors: { ...get().errors, getAdmitCard: message } });
    } finally {
      set({ loadingAdmitCard: false });
    }
  },
}));
