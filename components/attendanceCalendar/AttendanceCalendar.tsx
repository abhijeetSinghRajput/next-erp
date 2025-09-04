import { AttendanceData, useAttendanceStore } from "@/stores/useAttendanceStore";
import React, { useEffect, useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  startOfMonth,
  endOfMonth,
  parse,
  startOfWeek,
  endOfWeek,
  addWeeks,
} from "date-fns";
import { CheckCircle, X, Clock, RefreshCw } from "lucide-react";
import CalendarSkeleton from "./CalendarSkeleton";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

// Define the attendance item type
interface AttendanceItem {
  AttendanceDate: string;
  AttendanceType: "P" | "A" | "L" | "N/A";
  [key: string]: any;
}

// Define the attendance response type
interface AttendanceResponse {
  state: AttendanceItem[];
  [key: string]: any;
}

// Define the subject data type (matching the one from AttendanceTable)
interface SubjectData {
  Subject: string;
  SubjectCode: string;
  EMPNAME: string;
  TotalLecture: number;
  TotalPresent: number;
  TotalLeave: number;
  Percentage: number;
  SubjectID: number;
  RegID: number;
  PeriodAssignID: number;
  TTID: number;
  LectureTypeID: number;
}

// Define the data type for the calendar
interface CalendarData {
  DateFrom?: string;
  DateTo?: string;
  [key: string]: any;
}

interface AttendanceCalendarProps {
  selectedSubject: SubjectData;
  data: CalendarData;
}

const AttendanceCalendar = ({ selectedSubject, data }: AttendanceCalendarProps) => {
  const { getAttendanceBySubject, isLoadingSubjectDetails } =
    useAttendanceStore();
  const [date, setDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const [attendanceData, setAttendanceData] = useState<AttendanceResponse | null>(null);
  const { SubjectID, RegID, PeriodAssignID, TTID, LectureTypeID } =
    selectedSubject;

  // 🔁 Memoized map for fast lookup
  const attendanceMap = useMemo(() => {
    if (!attendanceData?.state) return new Map<number, AttendanceItem>();

    const map = new Map<number, AttendanceItem>();
    attendanceData.state.forEach((item: AttendanceItem) => {
      if (item.AttendanceType === "N/A") return;

      const dateKey = parse(
        item.AttendanceDate,
        "dd/MM/yyyy",
        new Date()
      ).getTime();
      map.set(dateKey, item);
    });
    return map;
  }, [attendanceData]);

  const getAttendanceForDate = (date: Date): AttendanceItem | undefined => {
    return attendanceMap.get(date.getTime());
  };

  const fetchAttendance = async () => {
    if (!selectedSubject) return;

    const visibleStart = startOfWeek(startOfMonth(currentMonth), {weekStartsOn: 0,});
    const visibleEnd = addWeeks(visibleStart, 6);

    const payload: AttendanceData = {
      RegID,
      SubjectID,
      PeriodAssignID,
      TTID,
      LectureTypeID,
      DateFrom: visibleStart,
      DateTo: visibleEnd,
    };

    try {
      const result = await getAttendanceBySubject(SubjectID.toString(), payload);
      setAttendanceData(result);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [selectedSubject, SubjectID, getAttendanceBySubject, currentMonth]);

  if (isLoadingSubjectDetails) return <CalendarSkeleton />;

  if (!attendanceData) {
    return (
      <div className="flex flex-col gap-2 justify-center items-center h-64">
        <p>No attendance data available</p>
        <Button size="sm" variant="outline" className="" onClick={fetchAttendance}>
          <RefreshCw />
          Reload
        </Button>
      </div>
    );
  }

  const startMonth = data?.DateFrom
    ? startOfMonth(new Date(data.DateFrom))
    : undefined;
  const endMonth = data?.DateTo ? endOfMonth(new Date(data.DateTo)) : undefined;

  const CustomDay = (props: any) => {
    const {
      day,
      modifiers,
      onClick,
      onFocus,
      onBlur,
      onKeyDown,
      onKeyUp,
      onMouseEnter,
      onMouseLeave,
    } = props;

    const { disabled, outside, hidden } = modifiers;
    const attendance = getAttendanceForDate(day.date);
    const dateNum = day.date.getDate();

    const baseClasses =
      "p-0 aspect-square flex items-center justify-center h-9 w-full rounded-md overflow-hidden";
    const buttonProps = {
      onClick,
      onFocus,
      onBlur,
      onKeyDown,
      onKeyUp,
      onMouseEnter,
      onMouseLeave,
      title: day.date.toDateString(),
    };

    if (!attendance || attendance.AttendanceType === "N/A") {
      return (
        <td className={cn(baseClasses)}>
          <Button
            variant="ghost"
            size="icon"
            className={cn("w-full", outside && "opacity-50")}
            {...buttonProps}
          >
            {dateNum}
          </Button>
        </td>
      );
    }

    const statusStyles: Record<string, { icon: React.ReactNode; bg: string }> = {
      P: {
        icon: <CheckCircle strokeWidth={3} className="text-green-500" />,
        bg: "dark:bg-green-800/30 bg-green-500/30",
      },
      A: {
        icon: <X strokeWidth={3} className="text-red-500" />,
        bg: "dark:bg-red-900/30 bg-red-500/30",
      },
      L: {
        icon: <Clock strokeWidth={3} className="text-yellow-500" />,
        bg: "dark:bg-yellow-800/30 bg-yellow-500/30",
      },
    };

    const status = statusStyles[attendance.AttendanceType] || { icon: null, bg: "" };

    return (
      <td className={cn("relative", baseClasses)}>
        <Button
          variant="secondary"
          size="icon"
          className={cn("w-full block", status.bg, outside && "opacity-50")}
          {...buttonProps}
        >
          <span className="absolute bottom-0.5 right-0.5">{status.icon}</span>
          {dateNum}
        </Button>
      </td>
    );
  };

  return (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border w-full bg-input/30"
        classNames={{}}
        formatters={{}}
        month={currentMonth}
        onMonthChange={(month: Date) => {
          setCurrentMonth(startOfMonth(month));
        }}
        components={{ Day: CustomDay }}
        fixedWeeks
        showOutsideDays
        defaultMonth={startMonth || new Date()}
        startMonth={startMonth}
        endMonth={endMonth}
      />
    </div>
  );
};

export default AttendanceCalendar;
