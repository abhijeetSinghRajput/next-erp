"use client";

import NoInternet from "@/components/emptyState/NoInternet";
import Header from "@/components/Header";
import { StudentProfile } from "@/components/profile/StudentProfile";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AttendanceTable from "@/components/table/AttendanceTable";
import Circular from "@/components/circular/Circular";
import ExamSummary from "@/components/exams/ExamSummary";
import FeeSubmissions from "@/components/fees/FeeSubmitions";
import { Mirage } from "ldrs/react";

const HomePageClient = () => {
  const { checkAuth, checkingAuth, authenticated } = useAuthStore();
  const { isOnline, isOffline } = useOnlineStatus();
  const router = useRouter();
  const [initializing, setInitializing] = useState(true); // handles first check only

  useEffect(() => {
    const verifyAuth = async () => {
      if (!isOnline) {
        setInitializing(false);
        return;
      }

      setInitializing(true);
      await checkAuth();
      setInitializing(false);
    };

    verifyAuth();
  }, [isOnline, checkAuth]);

  // 🚀 Redirect immediately after auth check
  useEffect(() => {
    if (!initializing && !checkingAuth && authenticated === false) {
      router.replace("/login");
    }
  }, [initializing, checkingAuth, authenticated, router]);

  // 🧭 Offline state
  if (isOffline) return <NoInternet />;

  // ⏳ Show loader immediately on mount and while checking auth
  if (initializing || checkingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Mirage size={70} speed={2.5} color="var(--foreground)" />
      </div>
    );
  }

  // 🧑‍🎓 Show homepage only after confirmed authentication
  if (!authenticated) return null;

  return (
    <div>
      <Header />
      <div className="space-y-6">
        <StudentProfile />
        <AttendanceTable />
        <Circular />
        <ExamSummary />
        <FeeSubmissions />
      </div>
    </div>
  );
};

export default HomePageClient;
