"use client";

import NoInternet from "@/components/emptyState/NoInternet";
import Header from "@/components/Header";
import { StudentProfile } from "@/components/profile/StudentProfile";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import { useAuthStore } from "@/stores/useAuthStore";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AttendanceTable from "@/components/table/AttendanceTable";
import Circular from "@/components/circular/Circular";
import ExamSummary from "@/components/exams/ExamSummary";
import FeeSubmissions from "@/components/fees/FeeSubmitions";
import { Infinity } from "ldrs/react";

const HomePage = () => {
  const { checkAuth, checkingAuth, authenticated } = useAuthStore();
  const { isOnline, isOffline } = useOnlineStatus();
  const router = useRouter();

  useEffect(() => {
    if (isOnline) {
      checkAuth();
    }
  }, [isOnline, checkAuth]);

  // redirect if not authenticated after checking
  useEffect(() => {
    if (!checkingAuth && authenticated === false) {
      router.replace("/login");
    }
  }, [checkingAuth, authenticated, router]);

  if (isOffline) {
    return <NoInternet />;
  }

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
         <Infinity
          size={30}
          speed={1.5}
          stroke={3}
          color="var(--foreground)"
        />
      </div>
    );
  }

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

export default HomePage;
