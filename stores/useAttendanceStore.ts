import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";
import { useStudentStore } from "./useStudentStore";

export interface AttendanceData {
  RegID: number;
  SubjectID: number;
  PeriodAssignID: number;
  TTID: number;
  LectureTypeID: number;
  DateFrom: Date;
  DateTo: Date;
}

export interface AttendanceState {
  attendance: any;
  subjectAttendanceCache: Record<string, any>;
  isLoadingSubjects: boolean;
  isLoadingSubjectDetails: boolean;
  errors: {
    getAllAttendanceSubjects: string | null;
    getAttendanceBySubject: string | null;
  };
  getAllAttendanceSubjects: (params: { RegID: string }) => Promise<void>;
  getAttendanceBySubject: (
    SubjectID: string,
    data: AttendanceData
  ) => Promise<any>;
  clearSubjectCache: (subjectId?: string | null) => void;
}

export const useAttendanceStore = create<AttendanceState>((set, get) => ({
  attendance: null,
  subjectAttendanceCache: {}, // New cache object
  isLoadingSubjects: false,
  isLoadingSubjectDetails: false,
  errors: {
    getAllAttendanceSubjects: null,
    getAttendanceBySubject: null,
  },

  getAllAttendanceSubjects: async ({ RegID }: { RegID: string }) => {
    if (!RegID) {
      set({
        attendance: null,
        errors: { ...get().errors, getAllAttendanceSubjects: "RegId not Provided" },
      });
      return;
    }
    set({
      isLoadingSubjects: true,
      errors: { ...get().errors, getAllAttendanceSubjects: null },
    });
    try {
      const res = await axiosInstance.get("/attendance", {
        params: { RegID },
      });
      set({ attendance: res.data });
    } catch (error: any) {
      const message =
        error?.response?.data.message ||
        "Something went wrong while fetching attendance.";
      toast.error(message);
      console.log(message, error);
      set({
        attendance: null,
        errors: { ...get().errors, getAllAttendanceSubjects: message },
      });
    } finally {
      set({ isLoadingSubjects: false });
    }
  },

  getAttendanceBySubject: async (SubjectID, data) => {
    set({
      isLoadingSubjectDetails: true,
      errors: { ...get().errors, getAttendanceBySubject: null },
    });

    try {
      // Check cache first
      const { subjectAttendanceCache } = get();
      const { student } = useStudentStore.getState();
      const cacheKey = `${student?.RegID}-${SubjectID}-${data.DateFrom}-${data.DateTo}`;

      if (subjectAttendanceCache[cacheKey]) {
        return subjectAttendanceCache[cacheKey];
      }

      // Not in cache, fetch from API
      const res = await axiosInstance.post(`/attendance/${SubjectID}`, data);

      // Update cache
      set((state) => ({
        subjectAttendanceCache: {
          ...state.subjectAttendanceCache,
          [cacheKey]: res.data,
        },
      }));

      return res.data;
    } catch (error: any) {
      const message =
        error?.response?.data.message ||
        "Something went wrong while fetching attendance details.";
      toast.error(message);
      // console.log(message, error);
      set({ errors: { ...get().errors, getAttendanceBySubject: message } });
      return null;
    } finally {
      set({ isLoadingSubjectDetails: false });
    }
  },

  // Clear cache for a specific subject or all
  clearSubjectCache: (subjectId = null) => {
    if (subjectId) {
      set((state) => {
        const newCache = { ...state.subjectAttendanceCache };
        Object.keys(newCache).forEach((key) => {
          if (key.startsWith(`${subjectId}-`)) {
            delete newCache[key];
          }
        });
        return { subjectAttendanceCache: newCache };
      });
    } else {
      set({ subjectAttendanceCache: {} });
    }
  },
}));
