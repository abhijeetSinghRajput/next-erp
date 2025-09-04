import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";
import type { AxiosError } from "axios";

interface StudentState {
    student: any;
    isFetchingProfile: boolean;
    avatarBlobUrl: string | null;
    errors: {
        fetchProfile: string | null;
    };
    loadingAvatar: boolean;

    fetchProfile: () => Promise<void>;
    loadAvatar: () => Promise<string | null>;
}

export const useStudentStore = create<StudentState>((set, get) => ({
    student: null,
    isFetchingProfile: false,
    avatarBlobUrl: null,
    errors: {
        fetchProfile: null,
    },
    loadingAvatar: false,

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
}));
