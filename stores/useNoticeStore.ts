import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";

export interface Circular {
  EmployeeName: unknown;
  CirID: number;
  Subject: string;
  Notice: string;
  DateFrom: string; //"12/04/2025"
  CollID: 1;
  DateTo: string; //"31/12/2025";
  ByDepartment: string;
  download: string;
  UnicolID: number;
  Chk: "0";
  CreatedOn: string; //"12/04/2025"
  ShowAsAPopup: boolean;
  ImageExtension: string; //".pdf";
  Circular: any | null;
}

interface NoticeStore {
  popupCirculars: Circular[];
  circulars: Circular[];
  allCirculars: Circular[];
  isLoadingCirculars: boolean;
  isLoadingCircularDetails: boolean;
  errors: {
    getCirculars: string | null;
    getAllCirculars: string | null;
  };

  getCirculars: () => Promise<void>;
  getAllCirculars: () => Promise<void>;
}

export const useNoticeStore = create<NoticeStore>((set, get) => ({
  popupCirculars: [],
  circulars: [],
  allCirculars: [],
  isLoadingCirculars: false,
  isLoadingCircularDetails: false,
  errors: {
    getCirculars: null,
    getAllCirculars: null,
  },

  getCirculars: async () => {
    set({
      isLoadingCirculars: true,
      errors: { ...get().errors, getCirculars: null },
    });
    try {
      const res = await axiosInstance.get("/circular");
      const { circular } = res.data;
      set({ popupCirculars: circular.filter((c: Circular) => c.ShowAsAPopup) });
      set({ circulars: (circular as Circular[]) || [] });
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to fetch circular";
      toast.error(message);
      set({
        circulars: [],
        errors: { ...get().errors, getCirculars: message },
      });
    } finally {
      set({ isLoadingCirculars: false });
    }
  },

  getAllCirculars: async () => {
    set({
      isLoadingCircularDetails: true,
      errors: { ...get().errors, getAllCirculars: null },
    });
    try {
      const res = await axiosInstance.get("/circular/all");
      const { circulars } = res.data;
      set({ allCirculars: (circulars as Circular[]) || [] });
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Something went wrong while fetching all notifications";
      toast.error(message);
      set({
        allCirculars: [],
        errors: { ...get().errors, getAllCirculars: message },
      });
    } finally {
      set({ isLoadingCircularDetails: false });
    }
  },
}));
