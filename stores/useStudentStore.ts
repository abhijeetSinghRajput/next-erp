import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";
import type { AxiosError } from "axios";

// Define the IdCardData interface
export interface IdCardData {
  Photo : string;
  StudentName : string;
  CourseBranch : string;
  StudentID : string;
  Batch : string;
  FatherName : string;
  MobileNo : string;
  BloodGroup : string;
  EmailID : string;
  PermanentAddress : string;
  ValidDate : string;
  EmergencyContactNo : string;
  AuthoritySignature : string;
  [key: string]: any;
}

interface StudentState {
  student: any;
  isFetchingProfile: boolean;
  avatarBlobUrl: string | null;
  errors: { fetchProfile: string | null };
  loadingAvatar: boolean;

  /** new fields */
  idCard: IdCardData | null;
  loadingIdCard: boolean;
  uploadingAvatar: boolean;
  sendingMail: boolean; // Added missing property
  requestingID: boolean; // Added missing property

  fetchProfile: () => Promise<void>;
  loadAvatar: () => Promise<string | null>;
  updateAvatar: (file: File) => Promise<void>;
  getIdCard: () => Promise<void>;
  requestPasswordResetLink: (data: any) => Promise<any>;
  getStudentId: (data: any) => Promise<any>;
}

export const useStudentStore = create<StudentState>((set, get) => ({
  student: null,
  isFetchingProfile: false,
  avatarBlobUrl: null,
  errors: {
    fetchProfile: null,
  },
  loadingAvatar: false,
  
  // Initialize the new fields
  idCard: null,
  loadingIdCard: false,
  uploadingAvatar: false,
  sendingMail: false,
  requestingID: false,

  fetchProfile: async () => {
    set({
      isFetchingProfile: true,
      errors: { ...get().errors, fetchProfile: null },
    });
    try {
      const res = await axiosInstance.get("/profile");
      set({ student: res.data });
    } catch (error: unknown) {
      const axiosError = error as AxiosError<any> | undefined;
      const message =
        axiosError?.response?.data?.message ||
        "Something went wrong while fetching profile";
      set({ errors: { ...get().errors, fetchProfile: message } });
      // console.log(message, error);
      toast.error(message);
    } finally {
      set({ isFetchingProfile: false });
    }
  },

  loadAvatar: async () => {
    set({ loadingAvatar: true });
    try {
      const response = await axiosInstance.get("/profile/avatar", {
        responseType: "blob",
      });
      const blobUrl = URL.createObjectURL(response.data);

      set({ avatarBlobUrl: blobUrl });
      return blobUrl;
    } catch (error) {
      // console.log("failed to load avatar");
      set({ avatarBlobUrl: null });
      return null;
    } finally {
      set({ loadingAvatar: false });
    }
  },

  updateAvatar: async (file) => {
    set({ uploadingAvatar: true });
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axiosInstance.post("/upload-avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Avatar uploaded successfully ✅");
      get().getIdCard();
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to upload avatar");
    } finally {
      set({ uploadingAvatar: false });
    }
  },

  getIdCard: async () => {
    set({ loadingIdCard: true });
    try {
      const response = await axiosInstance.get("/idcard");
      const idCard = {
        ...response.data,
        AuthoritySignature: `data:image/bmp;base64,${response.data?.AuthoritySignature}`,
        Photo: `data:image/bmp;base64,${response.data?.Photo}`,
      };

      set({ idCard });
    } catch (error) {
      console.log(error);
    } finally {
      set({ loadingIdCard: false });
    }
  },

  requestPasswordResetLink: async (data) => {
    set({ sendingMail: true });
    try {
      const response = await axiosInstance.post("/forgot-password", data);
      return response?.data?.result;
    } catch (error) {
      console.log(error);
      return null;
    } finally {
      set({ sendingMail: false });
    }
  },

  getStudentId: async (data) => {
    set({ requestingID: true });
    try {
      const response = await axiosInstance.post("/get-loginid", data);
      console.log(response.data);
      return response?.data?.result;
    } catch (error) {
      console.log(error);
      return null;
    } finally {
      set({ requestingID: false });
    }
  },
}));