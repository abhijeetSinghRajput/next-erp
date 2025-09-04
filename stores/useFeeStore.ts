import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";
import type { AxiosError } from "axios";

// Type definitions for fee data
export interface FeeReceipt {
  ReceiptModeID: number;
  "Receive/Payment": string;
  CombineReceiptNo: string;
  IsCombine: string;
  SocietyReceiptNo: string;
  ReceiptDate: string;
  CashAmount: number;
  ChequeAmount: number;
  DDAmount: number;
  OTAmount: number;
  POAmount: number;
  ChallanAmount: number;
  "POSM Amount": number;
  TotalAmount: number;
  FileReference: string;
  Remarks: string;
  RefundFeeID: number;
  AdjustID: number;
  "Adjust From": string;
  "Adjust To": string;
  "Book From": string;
  "Book To": string;
  ReceiptModeIDD: number;
  BookID: number;
  StuRegisID: string | null;
  CollegeID: string | null;
}

export interface FeeHeadData {
  FeeHeadID: number;
  LID: number;
  IsSeparate: boolean;
  IsFine: boolean;
  IsHostel: number;
  IsRegistration: boolean;
  IsTuitionFee: boolean;
  IsSociety: boolean;
  FeeHead: string;
  DueAmount: number;
  ReceivedAmount: number;
  RefundAmount: number;
  BalanceAmount: number;
  DepositAmount: number;
  PreExcess: number;
  SCAmount: number;
  NetDues: number;
  YearSem: number;
  FeeHeadPriority: number;
  FeeSYID: number;
  YS: string;
  ExcessFeeAmount: number;
  BookID: number;
  SecurityAdjusted: number;
  FineAmount: number;
}

export interface FeeSubmissions {
  headdata: FeeHeadData[];
  totaldue: string;
  totalreceive: string;
  totalbalance: string;
  adjust: string;
  headdatahostel: any[];
  excessfee: string;
  scholarshipSem: number;
}

interface FeeState {
  feeSubmissions: FeeSubmissions | null;
  feeReceipts: FeeReceipt[] | null;
  loadingFeeSubmissions: boolean;
  loadingFeeReceipts: boolean;
  downloadingReceipt: string | null;
  errors: {
    getFeeSubmissions: string | null;
    getFeeReceipts: string | null;
    downloadReceipt: string | null;
  };
  getFeeSubmissions: () => Promise<void>;
  getFeeReceipts: () => Promise<void>;
  downloadReceipt: (ReceiptModeID: number, BookID: number, CombineReceiptNo: string) => Promise<void>;
}

export const useFeeStore = create<FeeState>((set, get) => ({
  feeSubmissions: null,
  feeReceipts: null,
  loadingFeeSubmissions: false,
  loadingFeeReceipts: false,
  downloadingReceipt: null,
  errors: {
    getFeeSubmissions: null,
    getFeeReceipts: null,
    downloadReceipt: null,
  },

  // Fetch fee submissions
  getFeeSubmissions: async () => {
    set({
      loadingFeeSubmissions: true,
      errors: { ...get().errors, getFeeSubmissions: null },
    });
    try {
      const res = await axiosInstance.get("/fee");
      set({ feeSubmissions: res.data.feeSubmissions });
      // console.log(get().feeSubmissions);
    } catch (error: unknown) {
      const axiosError = error as AxiosError<any> | undefined;
      const message =
        axiosError?.response?.data?.message || "Failed to load fee submissions";
      set({ errors: { ...get().errors, getFeeSubmissions: message } });
      toast.error(message);
      console.error("Fee submissions error:", error);
    } finally {
      set({ loadingFeeSubmissions: false });
    }
  },

  // Fetch fee receipts
  getFeeReceipts: async () => {
    set({
      loadingFeeReceipts: true,
      errors: { ...get().errors, getFeeReceipts: null },
    });
    try {
      const res = await axiosInstance.get("/fee/receipts");
      set({ feeReceipts: res.data.feeReceipts });
    } catch (error: unknown) {
      const axiosError = error as AxiosError<any> | undefined;
      const message =
        axiosError?.response?.data?.message || "Failed to load fee receipts";
      set({ errors: { ...get().errors, getFeeReceipts: message } });
      toast.error(message);
      console.error("Fee receipts error:", error);
    } finally {
      set({ loadingFeeReceipts: false });
    }
  },

  // Download receipt
  downloadReceipt: async (ReceiptModeID: number, BookID: number, CombineReceiptNo: string) => {
    set({
      downloadingReceipt: CombineReceiptNo,
      errors: { ...get().errors, downloadReceipt: null },
    });
    try {
      const res = await axiosInstance.get("/fee/receipts/download", {
        params: { ReceiptModeID, BookID, CombineReceiptNo },
        responseType: "blob",
      });

      // Extract filename from headers or fallback
      const contentDisposition = res.headers["content-disposition"];
      const filename =
        contentDisposition?.match(/filename="?(.+)"?/)?.[1] ||
        `${CombineReceiptNo}-receipt.pdf`;

      // Trigger download
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: unknown) {
      const axiosError = error as AxiosError<any> | undefined;
      const message =
        axiosError?.response?.data?.message || "Failed to download receipt";
      set({ errors: { ...get().errors, downloadReceipt: message } });
      toast.error(message);
      console.error("Download error:", error);
    } finally {
      set({ downloadingReceipt: null });
    }
  },
}));
