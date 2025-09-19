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

const HomePage = () => {
  const { checkAuth, checkingAuth, authenticated } = useAuthStore();
  const { isOnline, isOffline } = useOnlineStatus();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (isOnline) {
      const verifyAuth = async () => {
        setIsChecking(true);
        await checkAuth();
        setIsChecking(false);
      };
      verifyAuth();
    } else {
      setIsChecking(false);
    }
  }, [isOnline, checkAuth]);

  // redirect if not authenticated after checking
  useEffect(() => {
    if (!isChecking && !checkingAuth && authenticated === false) {
      router.replace("/login");
    }
  }, [isChecking, checkingAuth, authenticated, router]);

  if (isOffline) {
    return <NoInternet />;
  }

  if (isChecking || checkingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Mirage size={70} speed={2.5} color="var(--foreground)" />
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
